import express from 'express'
import child_process from 'child_process'

const router = express.Router({ mergeParams: true })

router.get('/reset-seed', (req, res) => {
  child_process.fork('db/reset_seed.js')
    .on('close', () => {
      return res.status(200).send()
    })
})

export default router