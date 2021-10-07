import express from 'express'
import { authenticateTokenOptional } from '../auth/util.js'
import { updateCardListIdOrderOfBoard } from '../controllers/boards.js'
import { getCardListsByBoardId, createCardListByBoardId } from '../controllers/cardLists.js'

const router = express.Router({ mergeParams: true })

// get related card lists
router.get('/', getCardListsByBoardId)
router.post('/', authenticateTokenOptional, createCardListByBoardId)
router.patch('/', authenticateTokenOptional, updateCardListIdOrderOfBoard)

export default router