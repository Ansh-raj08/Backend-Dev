import express from 'express'
import { createuser, getuser, updateuser, deleteuser } from '../controllers/user.js'

const router = express.Router()

router.get('/user', getuser)

router.post('/user', createuser)

router.put('/user/:id',updateuser)
router.put('/updateuser', updateuser)
router.put('/updateuser/:id', updateuser)
router.delete('/deleteuser/:id', deleteuser)



export default router