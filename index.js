import express from "express";
import { createServer } from "http";
import cors from 'cors';
import { applyRoutes } from "./routes/index.js";
import { initDb } from "./db/init.js";
import SocketService from "./socketService.js";

const app = express()
const httpServer = createServer(app);
app.use(express.json())
app.use(cors())

// Init DB
initDb()

// Routes
applyRoutes(app)

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on Port:, http://localhost:${PORT}`)
})

app.set("socketService", new SocketService(httpServer))
