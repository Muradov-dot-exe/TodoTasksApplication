const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')

router.post('/add', taskController.createTask)
router.get('/', taskController.getAllTasks)
router.get('/:id', taskController.getTaskById)
router.put('/edit/:id', taskController.updateTask)
router.delete('/delete/:id', taskController.deleteTask)

module.exports = router
