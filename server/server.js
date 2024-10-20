// Install required packages: express, mongoose

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// app.use(cors());

app.use(cors (

{

origin: ["https://deploy-mern-1whq.vercel.app"], 
  methods: ["POST", "GET"],
  credentials: true

}

credentials: true

const PORT = 3001;

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Running");
});

// Routes
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  try {
    const newTask = new Task({ title, description, dueDate });
    await newTask.save();
    res.json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/tasks/:taskTitle', async (req, res) => {
  const { taskTitle } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ title: taskTitle });

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { title, description, dueDate }, { new: true });
    

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/tasks/completion/:taskTitle', async (req, res) => {
  const { taskTitle } = req.params;

  try {
    
    const task = await Task.findOne({ title: taskTitle });

    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    
    task.completed = !task.completed;

    // Save the updated task
    const updatedTask = await task.save();

    res.json({ message: 'Task completion status updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.connect('mongodb://127.0.0.1:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDb DataBase Connected");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = Task;
