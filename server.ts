import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiApp } from './server/api.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000; // Must be 3000

// Mount API
app.use(apiApp);

// In production, serve static files from dist
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
