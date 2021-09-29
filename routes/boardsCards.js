import express from 'express'
import { getCardsByBoardId } from '../controllers/cards.js'

const router = express.Router({ mergeParams: true })

// get related cards
router.get('/', getCardsByBoardId)

export default router