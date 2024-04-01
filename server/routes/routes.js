const express=require('express')
const router=express.Router()

const add=require('../controller/data')
const users=require('../controller/data')
const filter=require('../controller/data')
const team=require('../controller/data')

router.post('/add',add)
router.get('/users',users)
router.get('/users/:id',users)
router.get('/filter',filter)
router.post('/users',users)
router.post('/users/:id',users)
router.delete('/users/:id',users)
router.post('/team',team)
router.get('/team',team)
router.get('/team/:id',team)

module.exports = router;