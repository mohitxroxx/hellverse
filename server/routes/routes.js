const express=require('express')
const router=express.Router()

const add=require('../controller/data')
const users=require('../controller/data')

router.post('/add',add)
router.get('/users',users)
router.get('/users/:id',users)
router.post('/users',users)
router.post('/users/:id',users)
router.delete('/users/:id',users)

module.exports = router;