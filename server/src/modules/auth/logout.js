import express from 'express'
import { zeraValidToken } from '../../utils'

const router = new express.Router()

router.post('/', async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  console.info('POST logout', token)

  const user = await zeraValidToken(token)
  if (!user) {
    return res.status(401).end()
  }
  return res.status(200).json({
    message: 'Saiu.',
    success: true
  })
})

// export default router
module.exports = router
