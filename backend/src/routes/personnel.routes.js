const express = require('express')
const router = express.Router()
const personnelController = require('../controllers/personnelController')
const authController = require('../controllers/authController')

router.post('/add', personnelController.createPersonnel)
router.get('/', personnelController.getAllPersonnel)
router.get('/:id', personnelController.getPersonnelById)
router.put('/edit/:id', personnelController.updatePersonnel)
router.delete('/delete/:id', personnelController.deletePersonnel)

module.exports = router
