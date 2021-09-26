import express from "express";
import cors from 'cors';
import { applyRoutes } from "./routes/index.js";
import { initDb } from "./db/init.js";

const app = express()

app.use(express.json())
app.use(cors())

// Init DB
initDb()

// Routes
applyRoutes(app)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on Port:, http://localhost:${PORT}`)
})