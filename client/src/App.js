// Install required packages: react, react-dom, axios
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [updateTask, setUpdateTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/tasks")
      .then((response) => setTasks(response.data.tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    console.log('Adding task:', newTask);

    axios
      .post("http://localhost:3001/tasks", newTask)
      .then((response) => {
        setTasks([...tasks, response.data.task]);
        setNewTask({ title: "", description: "", dueDate: "" });
        alert("Addes Succesfully")
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  
  const handleToggleCompletion = (title) => {
    
  axios
    .put(`http://localhost:3001/tasks/completion/${encodeURIComponent(title)}`)
    .then((response) => {
      const updatedTasks = tasks.map((task) =>
        task.title === title ? response.data.task : task
      );
      setTasks(updatedTasks);
    })
    .catch((error) => console.error("Error updating task:"));
};




  const handleDeleteTask = (title) => {
    axios
      .delete(`http://localhost:3001/tasks/${encodeURIComponent(title)}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task.title !== title);
        setTasks(updatedTasks);
        alert(`Task with title "${title}" deleted successfully`);
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const calculateRemainingDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - today.getTime();
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return remainingDays >= 0 ? remainingDays : "Expired";
  };

  const handleEditTask = (task) => {
    setUpdateTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setEditMode(task._id || task.title);
  };


  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateTask({ ...updateTask, [name]: value });
  };

  const handleUpdateTask = (task) => {
  const identifier = task._id;
  axios.put(`http://localhost:3001/tasks/${identifier}`, updateTask)
    .then(updatedTask => {
      const updatedTasks = tasks.map(t =>
        t._id === task._id ? updatedTask.data.task : t
      );
      setTasks(updatedTasks);
      setUpdateTask({ title: '', description: '', dueDate: '' });
      setEditMode(null);
    })
    .catch(error => console.error('Error updating task:', error));
};

  return (
    <div className="app-container">
      <h1>Task Manager</h1>
      <input
        type="text"
        name="title"
        value={newTask.title}
        onChange={handleInputChange}
        placeholder="Task title"
        className="inputtitle"
      />
      <input
        type="text"
        name="description"
        value={newTask.description}
        onChange={handleInputChange}
        placeholder="Task description"
        className="inputdesc"
      />
      <input
        type="date"
        name="dueDate"
        value={newTask.dueDate}
        onChange={handleInputChange}
        placeholder="Due date"
        className="inputdate"
      />
      <button className="addbtn"onClick={handleAddTask}>Add Task</button>

      <ul>
      
        {tasks.map((task) => (
          <li key={task._id}>
            <div className="container">
              <div className="tasktitle">
                {" "}
                <h3>Title</h3>
                {task.title}{" "}
              </div>
              <div className="taskdesc">
                {" "}
                <h3>Description</h3>
                {task.description}{" "}
              </div>

              <div >
              {task.dueDate && (
                  <span className="remDays">
                    Remaining days to complete the task: {calculateRemainingDays(task.dueDate)}
                  </span>
                )}
              </div>
              <div className="status">Completed: {task.completed.toString()} </div>
              <div className="action">
                <button
                  type="button"
                  className="btncomplete"
                  onClick={() => handleToggleCompletion(task.title)}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
              

                <button
                  type="button"
                  className="btndelete"
                  onClick={() => handleDeleteTask(task.title)}
                >
                  Delete
                </button>
                </div>
                
                </div>
              
                
                {editMode === (task._id || task.title) ? (
                <div>
                  <input type="text"  name="title" value={updateTask.title} onChange={handleUpdateInputChange} placeholder="Task title" />
                  <input type="text"  name="description" value={updateTask.description} onChange={handleUpdateInputChange} placeholder="Task description" />
                  <input type="date"  name="dueDate" value={updateTask.dueDate} onChange={handleUpdateInputChange} placeholder="Due date" />
                  <button  className="editbtn" onClick={() => handleUpdateTask(task)}>
                    Update Task
                  </button>
                </div>
              ) : (
                <button className="editbtn"onClick={() => handleEditTask(task)}>Edit</button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



