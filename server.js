
import express from 'express'
import bodyParser from 'body-parser';
import OpenAI from "openai";
import 'dotenv/config';


const app = express();
const port = 5000;

const openai = new OpenAI({
    organization: "YOUR_ORG_ID",
    project: "$PROJECT_ID",
});

app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are an expert in analyzing ML Engineer salaries data. Provide insights based on the following user query: "${message}"`,
      max_tokens: 150,
    });

    const reply = completion.data.choices[0].text.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
