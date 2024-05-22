import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import 'dotenv/config';

const app = express();
const port = 5000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // Log the request body
  console.log('Request body:', req.body);

  try {
    const completion = await openai.chat.completions.create({
      model: "text-davinci-003",
      prompt: `You are an expert in analyzing ML Engineer salaries data. Provide insights based on the following user query: "${message}"`,
      max_tokens: 150,
    });
    const reply = completion.choices[0].text.trim();

    // Log the OpenAI API response
    console.log('OpenAI API response:', completion);

    res.json({ reply });
  } catch (error) {
    // Log the error message and response data
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);

    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});