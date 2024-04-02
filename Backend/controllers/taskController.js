const Task = require('../models/taskModel');
const Joi = require('joi');

// Esquema de validación para la creación y actualización de tareas
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(0).max(1000),
  completed: Joi.boolean(),
  priority: Joi.string().valid('low', 'medium', 'high')
});

// Obtener todas las tareas con paginación y ordenamiento
exports.getAllTasks = async (req, res) => {
  try {
    // Parámetros de paginación y ordenamiento
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt'; // Campo para ordenar
    const sortOrder = req.query.sortOrder || 'desc'; // Orden ascendente o descendente

    // Contar total de tareas
    const totalTasks = await Task.countDocuments();

    // Calcular número de páginas
    const totalPages = Math.ceil(totalTasks / limit);

    // Obtener las tareas de la página actual
    const tasks = await Task.find()
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Respuesta con resultados, información de paginación y ordenamiento
    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las tareas' });
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  // Validar datos de entrada
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Crear nueva tarea
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed || false,
    priority: req.body.priority || 'low'
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtener una tarea por su ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar una tarea por su ID
exports.updateTask = async (req, res) => {
  // Validar datos de entrada
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar la prioridad de una tarea por su ID
exports.updateTaskPriority = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { priority: req.body.priority }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una tarea por su ID
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
