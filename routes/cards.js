import express from 'express'
import { authenticateTokenOptional } from '../auth/util.js'
import { deleteCardById, updateCardById } from '../controllers/cards.js'

const router = express.Router({ mergeParams: true })

router.patch('/:id', authenticateTokenOptional, updateCardById)
router.delete('/:id', authenticateTokenOptional, deleteCardById)

export default router