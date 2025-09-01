
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ---- LocalStorage keys ----
const TOKEN_KEY = "taskflux_token";
const USER_KEY  = "taskflux_user";

// ---- Token helpers ----
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

// ---- Core request wrapper ----
async function request(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const h = { "Content-Type": "application/json", ...headers };
  if (auth) {
    const t = getToken();
    if (t) h["Authorization"] = `Bearer ${t}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });


  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // normalize error message
    const msg = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}



// POST /auth/register  
export async function apiRegister({ name, email, password }) {
  const data = await request("/auth/register", {
    method: "POST",
    body: { name, email, password }
  });
  // optional: store token & user if backend returns them
  if (data?.access_token) setToken(data.access_token);
  if (data?.user) setUser(data.user);
  return data;
}

// POST /auth/login
export async function apiLogin({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password }
  });
  if (data?.access_token) setToken(data.access_token);
  if (data?.user) setUser(data.user);
  return data;
}

// GET /auth/profile
export async function apiGetProfile() {
  const data = await request("/auth/profile", { auth: true });
  return data?.user;
}

// PUT /auth/profile
export async function apiUpdateProfile({ name, email }) {
  const data = await request("/auth/profile", {
    method: "PUT",
    auth: true,
    body: { name, email }
  });
  if (data?.user) setUser(data.user);
  return data?.user;
}

//  POST /auth/verify-token
export async function apiVerifyToken() {
  return request("/auth/verify-token", { method: "POST", auth: true });
}




// GET /tasks?status=&priority=
export async function apiListTasks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const p = `/tasks${qs ? `?${qs}` : ""}`;
  const data = await request(p, { auth: true });
  return data?.tasks || [];
}

// POST /tasks
export async function apiCreateTask(payload) {
  const data = await request("/tasks", {
    method: "POST",
    auth: true,
    body: payload
  });
  return data?.task;
}

// PUT /tasks/:id
export async function apiUpdateTask(id, payload) {
  const data = await request(`/tasks/${id}`, {
    method: "PUT",
    auth: true,
    body: payload
  });
  return data?.task;
}

// DELETE /tasks/:id
export async function apiDeleteTask(id) {
  const data = await request(`/tasks/${id}`, { method: "DELETE", auth: true });
  return data?.deleted;
}

export { BASE_URL };
