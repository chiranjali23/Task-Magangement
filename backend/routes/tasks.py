from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db_connection
import datetime

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

def _ok(data=None, status=200):
    return jsonify({"success": True, **(data or {})}), status

def _err(msg, status=400):
    return jsonify({"success": False, "message": msg}), status

@tasks_bp.post("")
@jwt_required()
def create_task():
    """Create a new task for the logged-in user"""
    uid = get_jwt_identity()
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    priority = (data.get("priority") or "medium").lower()
    status = (data.get("status") or "pending").lower()
    due_date = data.get("due_date")  # ISO string: "2025-09-10T12:30"

    if not title:
        return _err("title is required", 400)

    # parse due_date if provided
    due_dt = None
    if due_date:
        try:
            # accept "YYYY-MM-DD" or ISO with time
            if len(due_date) == 10:
                due_dt = datetime.datetime.strptime(due_date, "%Y-%m-%d")
            else:
                due_dt = datetime.datetime.fromisoformat(due_date)
        except Exception:
            return _err("Invalid due_date format. Use YYYY-MM-DD or ISO 8601.", 400)

    db = get_db_connection()
    q = """INSERT INTO tasks (user_id, title, description, status, priority, due_date)
           VALUES (%s, %s, %s, %s, %s, %s)"""
    params = (uid, title, description or None, status, priority, due_dt)

    res = db.execute_query(q, params, fetch=False)  # your helper commits (autocommit True)
    new_id = res["lastrowid"] if isinstance(res, dict) and "lastrowid" in res else None

    # return the created row
    sel = db.execute_query("SELECT * FROM tasks WHERE id=%s AND user_id=%s", (new_id, uid), fetch=True)
    return _ok({"task": sel[0]} if sel else {"id": new_id}, 201)

@tasks_bp.get("")
@jwt_required()
def list_tasks():
    """List tasks for logged-in user; optional ?status=&priority="""
    uid = get_jwt_identity()
    status = request.args.get("status")
    priority = request.args.get("priority")

    base = "SELECT * FROM tasks WHERE user_id=%s"
    params = [uid]
    if status:
        base += " AND status=%s"
        params.append(status)
    if priority:
        base += " AND priority=%s"
        params.append(priority)
    base += " ORDER BY created_at DESC"

    db = get_db_connection()
    rows = db.execute_query(base, tuple(params), fetch=True)
    return _ok({"tasks": rows})

@tasks_bp.put("/<int:task_id>")
@jwt_required()
def update_task(task_id):
    """Update fields of a task that belongs to the user"""
    uid = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    fields = []
    params = []
    for key in ("title","description","status","priority"):
        if key in data and data[key] is not None:
            fields.append(f"{key}=%s")
            params.append(data[key])

    if "due_date" in data:
        due_date = data["due_date"]
        if due_date:
            try:
                if len(due_date) == 10:
                    due_dt = datetime.datetime.strptime(due_date, "%Y-%m-%d")
                else:
                    due_dt = datetime.datetime.fromisoformat(due_date)
            except Exception:
                return _err("Invalid due_date format", 400)
            fields.append("due_date=%s")
            params.append(due_dt)
        else:
            fields.append("due_date=%s")
            params.append(None)

    if not fields:
        return _err("No fields to update", 400)

    params.extend([task_id, uid])

    db = get_db_connection()
    q = f"UPDATE tasks SET {', '.join(fields)} WHERE id=%s AND user_id=%s"
    db.execute_query(q, tuple(params), fetch=False)

    sel = db.execute_query("SELECT * FROM tasks WHERE id=%s AND user_id=%s", (task_id, uid), fetch=True)
    if not sel:
        return _err("Task not found", 404)
    return _ok({"task": sel[0]})

@tasks_bp.delete("/<int:task_id>")
@jwt_required()
def delete_task(task_id):
    uid = get_jwt_identity()
    db = get_db_connection()
    # check exists
    sel = db.execute_query("SELECT id FROM tasks WHERE id=%s AND user_id=%s", (task_id, uid), fetch=True)
    if not sel: 
        return _err("Task not found", 404)
    db.execute_query("DELETE FROM tasks WHERE id=%s AND user_id=%s", (task_id, uid), fetch=False)
    return _ok({"deleted": task_id})
