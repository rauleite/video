import express from 'express'
import request from 'request-promise'
const router = new express.Router()

router.get('/', (req, res, next) => {
  console.log('--> misc/redirect', req.body)
  res.redirect('/counter')
  
})

export default router
