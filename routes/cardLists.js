import express from 'express'
import { authenticateTokenOptional } from '../auth/util.js'
import { deleteCardListById, updateCardListById, getCardListById } from '../controllers/cardLists.js'
import cardListsCardRoutes from './cardListsCards.js'

const router = express.Router({ mergeParams: true })

router.use('/:cardListId/cards', cardListsCardRoutes)

router.get('/:id', getCardListById)
router.patch('/:id', authenticateTokenOptional, updateCardListById)
router.delete('/:id', authenticateTokenOptional, deleteCardListById)

export default router