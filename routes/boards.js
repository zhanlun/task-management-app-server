import express from 'express'
import { createBoard, deleteBoardById, getBoardById, getBoards, updateBoardById } from '../controllers/boards.js'
const router = express.Router()

router.get('/', getBoards)
router.get('/:id', getBoardById)
router.delete('/:id', deleteBoardById)
router.patch('/:id', updateBoardById)
router.post('/', createBoard)

export default router