import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const { ANTHROPIC_API_KEY } = process.env;

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY
  });

  const agent = 

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
