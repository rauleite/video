import express from 'express'

const router = new express.Router()

router.get('/dashboard', (req, res) => {
  console.log('GET --> dashboard req.body', req.body)
  res.status(200).json({
    message: "You're authorized to see this secret message.",
    success: true
  })
})

module.exports = router
