import express, {Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";

import driversRouter from './routes/drivers'
import shipmentsRouter from './routes/shipments'
import returnsRouter from './routes/returns'
import routesRouter from './routes/routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/drivers', driversRouter)
app.use('/api/shipments', shipmentsRouter)
app.use('/api/returns', returnsRouter)
app.use('/api/routes', routesRouter)

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: 'AIRO Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
