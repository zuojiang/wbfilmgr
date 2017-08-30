import express from 'express'

const router = express.Router()

router.use((req, res, next) => {
  if (!req.session.items) {
    req.session.items = [
      'Item 1',
      'Item 2',
      'Item 3',
    ]
  }
  next()
})

router.use('/test', (req, res, next) => {
  const {
    action,
  } = req.body
  const {
    items,
  } = req.session

  switch (action) {
    case 'addItem':
      const data = `Item ${items.length + 1}`
      items.push(data)
      res.json({
        data,
      })
      break
    default:
      next()
  }
})

export default router
