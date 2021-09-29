import boardRoutes from './boards.js'
import cardListRoutes from './cardLists.js'
import cardRoutes from './cards.js'

export const applyRoutes = (app) => {
  app.use('/boards', boardRoutes)
  app.use('/card-lists', cardListRoutes)
  app.use('/cards', cardRoutes)
}