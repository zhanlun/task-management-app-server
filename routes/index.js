import boardRoutes from './boards.js'
import cardListRoutes from './cardLists.js'
import cardRoutes from './cards.js'
import authRoutes from './auth.js'
import testRoutes from './test.js'


export const applyRoutes = (app) => {
  app.use('/auth', authRoutes)
  app.use('/boards', boardRoutes)
  app.use('/card-lists', cardListRoutes)
  app.use('/cards', cardRoutes)

  if (process.env.NODE_ENV !== 'production') {
    app.use('/test', testRoutes)
  }
}