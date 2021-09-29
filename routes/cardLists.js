import express from 'express'
import { deleteCardListById, updateCardListById } from '../controllers/cardLists.js'
import cardListsCardRoutes from './cardListsCards.js'

const router = express.Router({ mergeParams: true })

router.use('/:cardListId/cards', cardListsCardRoutes)

router.patch('/:id', updateCardListById)
router.delete('/:id', deleteCardListById)

export default router