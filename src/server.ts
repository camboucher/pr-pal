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

app.post('/generate-pr', async (req, res) => {
    const { gitDiff, additionalInfo, templateType } = req.body;

    const prompt = `
        Create a Pull Request description based on the following Git diff and context:
        - Git Diff:
        ${gitDiff}

        - Additional Info:
        ${additionalInfo}

        - Use the "${templateType}" template. Include sections for "What Changed", "Why", and "How". Use concise, professional language.
    `;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 1000,
        });

        res.json({ prDescription: response.data.choices[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PR description.' });
    }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
