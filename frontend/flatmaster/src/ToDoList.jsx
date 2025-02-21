import React, { useState, useEffect } from "react";
import axios from "axios";
import './index.css';
import { v4 as uuidv4 } from "uuid";

const generateNumericUUID = () => {
    return parseInt(uuidv4().replace(/-/g, '').slice(0, 15), 16);
};

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // 📌 Lấy danh sách tasks từ backend khi load trang
    useEffect(() => {
        axios.get("https://api.yinkenna.site/tasks")
            .then(response => {
                console.log("Tasks:", response.data);
                setTasks(response.data);
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    // 📌 Thêm task mới vào database
    const addTask = async () => {
        if (newTask.trim() !== "") {
            try {
                const taskId = generateNumericUUID();
                console.log("Adding task with ID:", taskId);

                const response = await axios.post("https://api.yinkenna.site/tasks", { id: taskId, task: newTask });

                console.log("Response:", response.data);
                setTasks([...tasks, response.data]);
                setNewTask("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };

    // 📌 Xóa task khỏi database
    const deleteTask = async (id) => {
        try {
            console.log("Deleting task with ID:", id);
            await axios.delete(`https://api.yinkenna.site/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="to-do-list">
            <h1>To Do List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter the task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button className="btnAdd" onClick={addTask}>Add</button>
            </div>
            <ol>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <span className="text">{task.task}</span>
                        <button className="btnDel" onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDoList;
