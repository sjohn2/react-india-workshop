const express = require('express');
const axios = require('axios');
const cors = require('cors'); 

const app = express();
const port = 5000; 

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { message } = req.body;
  console.log('Received message from client:', message);

  try {
    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'gemma2:2b',
      prompt: message,
      stream: false
    });

    console.log('Response from Ollama:', response.data.response);
    res.send(response.data);
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    res.status(500).send('Error communicating with Ollama');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});