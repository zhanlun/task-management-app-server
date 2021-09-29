import express from 'express'
import { updateCardIdOrderOfCardList } from '../controllers/cardLists.js'
import { createCardByCardListId, getCardsByCardListId } from '../controllers/cards.js'

const router = express.Router({ mergeParams: true })

// get related card
router.get('/', getCardsByCardListId)
router.post('/', createCardByCardListId)
router.patch('/', updateCardIdOrderOfCardList)

export default router