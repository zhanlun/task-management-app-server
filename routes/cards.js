import express from 'express'
import { deleteCardById, updateCardById } from '../controllers/cards.js'

const router = express.Router({ mergeParams: true })

router.patch('/:id', updateCardById)
router.delete('/:id', deleteCardById)

export default router