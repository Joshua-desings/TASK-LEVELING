const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Prefijo para todas las rutas de tareas
router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.get('/tasks/:taskId', taskController.getTaskById);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

module.exports = router;
