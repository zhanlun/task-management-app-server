import express from 'express'
import { updateCardListIdOrderOfBoard } from '../controllers/boards.js'
import { getCardListsByBoardId, createCardListByBoardId } from '../controllers/cardLists.js'

const router = express.Router({ mergeParams: true })

// get related card lists
router.get('/', getCardListsByBoardId)
router.post('/', createCardListByBoardId)
router.patch('/', updateCardListIdOrderOfBoard)

export default router