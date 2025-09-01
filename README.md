# 📌 TaskFlux – Task Manager Application

TaskFlux is a simple **Task Management System** built with **React (frontend)**, **Flask (backend)**, and **MySQL (database)**.  
It allows users to register, log in, and manage their daily tasks efficiently with JWT authentication.  

---

## 🚀 Features

- 🔑 User Registration & Login (JWT-based authentication)  
- 👤 User profile management  
- 📝 Create, Update, Delete tasks  
- 📊 Task status & priority tracking  
- 💾 Persistent storage with MySQL  
- 🎨 Clean and responsive UI with React  

---

## 🛠️ Technologies Used

### Frontend
- React.js  
- Axios  
- Tailwind CSS  

### Backend
- Python Flask  
- Flask-JWT-Extended  
- Flask-Bcrypt  
- MySQL  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/chiranjali23/Task-Magangement.git
cd Task-Magangement
```

---

### 2. Backend Setup (Flask)
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # (Windows)
source venv/bin/activate # (Linux/Mac)

pip install -r requirements.txt
```

- Create a `.env` file inside `backend/` and configure:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_db

SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
FLASK_DEBUG=True
```

- Run the backend:
```bash
python app.py
```
✅ Backend will run on `http://127.0.0.1:5000`

---

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```
✅ Frontend will run on `http://localhost:3000`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| POST   | `/api/register` | Register new user    |
| POST   | `/api/login`    | Login user           |
| GET    | `/api/profile`  | Get user profile     |

### Tasks
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | `/api/tasks`    | List all tasks       |
| POST   | `/api/tasks`    | Create new task      |
| PUT    | `/api/tasks/:id`| Update existing task |
| DELETE | `/api/tasks/:id`| Delete a task        |

---

## 📷 Screenshots (Optional)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/Addtask.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/changepassword.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/dispalyPending.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/displayCompeleted.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/displayDelete.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/editTask.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/login.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/main.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/profile.png)
![TaskFlux UI](https://github.com/chiranjali23/Task-Magangement/blob/main/fontend/taskManagement/public/screenshot/register.png)





---

## 👩‍💻 Author
**A. K. A. Chiranjali**  
Institute of Technology, University of Moratuwa  

---

## 📜 License
This project is licensed under the **MIT License**.  
