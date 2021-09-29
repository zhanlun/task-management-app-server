import express from 'express'
import { createBoard, deleteBoardById, getBoardById, getBoards, updateBoardById } from '../controllers/boards.js'
import boardsCardListsRoutes from './boardsCardLists.js'
import boardsCardsRoutes from './boardsCards.js'
const router = express.Router()

router.use('/:boardId/cards', boardsCardsRoutes)
router.use('/:boardId/card-lists', boardsCardListsRoutes)

router.get('/', getBoards)
router.get('/:id', getBoardById)
router.delete('/:id', deleteBoardById)
router.patch('/:id', updateBoardById)
router.post('/', createBoard)

export default router