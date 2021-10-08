import express from 'express'
import { authenticateTokenOptional } from '../auth/util.js'
import { updateCardIdOrderOfCardList } from '../controllers/cardLists.js'
import { createCardByCardListId, getCardsByCardListId } from '../controllers/cards.js'

const router = express.Router({ mergeParams: true })

// get related card
router.get('/', getCardsByCardListId)
router.post('/', authenticateTokenOptional, createCardByCardListId)
router.patch('/', authenticateTokenOptional, updateCardIdOrderOfCardList)

export default router