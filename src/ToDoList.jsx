import React, { useState } from 'react';
function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    function handleInputChange(event) {
        setNewTask(event.target.value);

    }
    function addTask() {
        if (newTask.trim() !== "") {
            setTasks(t => [...t, newTask]);
            setNewTask("");
        }

    }
    function deleteTask(index) {
        const updateTask = tasks.filter((_, i) => i !== index);
        setTasks(updateTask);
    }
    function moveTaskUp(index) {
        if (index > 0) {
            const updateTask = [...tasks];
            [updateTask[index], updateTask[index - 1]] =
                [updateTask[index - 1], updateTask[index]];
            setTasks(updateTask);
        }
    }
    function moveTaskDown(index) {
        if (index < tasks.length -1) {
            const updateTask = [...tasks];
            [updateTask[index], updateTask[index + 1]] =
                [updateTask[index + 1], updateTask[index]];
            setTasks(updateTask);
        }
    }
    return (
        <div className="to-do-list">
            <h1>To Do List</h1>
            <div>
                <input
                    type='text'
                    placeholder='Enter the task...'
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className='btnAdd' onClick={addTask}>Add</button>
            </div>
            <ol>
                {tasks.map((task, index) =>
                    <li key={index}>
                        <span className='text'>{task}</span>
                        <button className='btnDel' onClick={() => deleteTask(index)}>Delete</button>
                        <button className='btnUp' onClick={() => moveTaskUp(index)}>Up</button>
                        <button className='btnDown' onClick={() => moveTaskDown(index)}>Down</button>
                    </li>
                )}
            </ol>
        </div >
    )
}
export default ToDoList