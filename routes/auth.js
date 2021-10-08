import express from 'express'
import { loginUser, signUpUser, loadUser } from '../auth/authController.js'
import { authenticateToken } from '../auth/util.js'

const router = express.Router({ mergeParams: true })

router.post('/login', loginUser)
router.post('/signup', signUpUser)
router.get('/user', authenticateToken, loadUser)

export default router