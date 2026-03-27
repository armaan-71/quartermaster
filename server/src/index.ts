import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { parseEntities } from './controllers/parseController';
import { validateEntities } from './controllers/validateController';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/parse', parseEntities);
app.post('/api/validate', validateEntities);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
