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
    let augmentedPrompt = message; // Initialize with the original message  

    // Check if the message contains the keyword "bitcoin"  
    if (message.toLowerCase().includes('bitcoin')) {  
      // Fetch Bitcoin price from CoinDesk API  
      const priceResponse = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');  
      const bitcoinPrice = priceResponse.data.bpi.USD.rate;  

      // Include Bitcoin price in the prompt  
      augmentedPrompt = `The current price of Bitcoin is ${bitcoinPrice}. ${message}`;  
      console.log(augmentedPrompt); 
    }  

    const response = await axios.post('http://127.0.0.1:11434/api/generate', {  
      model: 'gemma2:2b',  
      prompt: augmentedPrompt, // Use the augmented prompt  
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