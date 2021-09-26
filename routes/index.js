import boardRoutes from './boards.js'

export const applyRoutes = (app) => {
  app.use('/boards', boardRoutes)
}