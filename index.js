const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); 
const {langChain} = require('./langChain');
const LangChain = require('./langChain');
const cors = require('cors');

const app = express();

app.use(cors());

// Set up request logging using morgan middleware
app.use(morgan('dev'));

// Parse JSON request bodies
app.use(bodyParser.json());

// Handle GET requests with a request body
app.post('/api/getWithBody', (req, res) => {
  const prompt = req.body.prompt;
  const langChain=new LangChain();
  langChain.run(prompt);
  langChain.run(prompt)
  .then((data) => {
    console.log(data);
    res.json({ message: `Received prompt: ${prompt}`, data : `${data.text}` }); // This will be executed when the async function is done.
  })
  .catch((error) => {
    console.error(error);
    res.json({ message: `Received error: ${error}`, data : `${error}` });
  });
  
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
