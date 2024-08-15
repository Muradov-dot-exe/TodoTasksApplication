const express = require('express')
const router = express.Router()
const multer = require('multer')

const upload = multer()
const subtaskController = require('../controllers/subtaskController')

router.post('/add', subtaskController.createSubtask)
router.get('/', subtaskController.getAllSubtasks)
router.get('/:id', subtaskController.getSubtaskById)
router.put('/edit/:id', subtaskController.updateSubtask)
router.delete('/delete/:id', subtaskController.deleteSubtask)
router.post(
    '/upload-image/:id',
    upload.single('file'),
    subtaskController.uploadImage
)
router.post('/add-note/:id', subtaskController.addNote)
router.delete('/delete-image/:id/:name', subtaskController.deleteImage)
router.delete('/delete-note/:id/:note', subtaskController.deleteNote)

module.exports = router
