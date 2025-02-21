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

    useEffect(() => {
        axios.get("https://api.yinkenna.site/tasks")
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    const addTask = async () => {
        if (newTask.trim() !== "") {
            try {
                const taskId = generateNumericUUID();

                const response = await axios.post("https://api.yinkenna.site/tasks", { id: taskId, task: newTask });

                setTasks([...tasks, response.data]);
                setNewTask("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };

    const deleteTask = async (id) => {
        try {
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
