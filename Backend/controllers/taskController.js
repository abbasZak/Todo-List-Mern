const Task = require("../models/taskModels");

const addTask = async (req, res) => {
  try {
    const { taskName, taskDescription, userId } = req.body; // <-- include userId

    if (!taskName)
      return res.status(400).json({ message: "Task name field is required" });

    if (!userId)
      return res.status(400).json({ message: "User ID is required" }); // <-- validate userId

    const newTask = await Task.create({
      userId,           // <-- add userId
      taskName,
      taskDescription,  // optional
    });

    res.status(201).json({
      message: "Task successfully added",
      Task: {
        id: newTask._id,
        taskName: newTask.taskName,
        taskDescription: newTask.taskDescription,
        userId: newTask.userId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Backend
const getTask = async (req, res) => {
  const { userId } = req.params;

  try {
      // Find user with particular id
      const tasks = await Task.find({userId});
      res.json({ userTask: tasks, message: "Task fetched successfully" });
    }  catch(err) {
      res.status(500).json({message: err.message});
    }
}


module.exports = { addTask, getTask };