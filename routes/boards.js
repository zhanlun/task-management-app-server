import express from 'express'
import { authenticateToken } from '../auth/util.js'
import { createBoard, deleteBoardById, getBoardById, getBoards, updateBoardById } from '../controllers/boards.js'
import boardsCardListsRoutes from './boardsCardLists.js'
import boardsCardsRoutes from './boardsCards.js'
const router = express.Router()

router.use('/:boardId/cards', boardsCardsRoutes)
router.use('/:boardId/card-lists', boardsCardListsRoutes)

router.get('/', authenticateToken, getBoards)
router.get('/:id', getBoardById)
router.delete('/:id', authenticateToken, deleteBoardById)
router.patch('/:id', authenticateToken, updateBoardById)
router.post('/', authenticateToken, createBoard)

export default router