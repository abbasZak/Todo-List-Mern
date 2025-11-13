const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.route('/addTask').post(taskController.addTask);
router.route('/:userId').get(taskController.getTask);


module.exports = router;