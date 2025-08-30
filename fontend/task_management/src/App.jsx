import React from 'react'; // Explicitly import React
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-sm bg-white rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-blue-600">Task Manager</h1>
        <p className="text-gray-700">Frontend with React + Tailwind CSS</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Task
        </button>
      </div>
    </div>
  );
}

export default App;