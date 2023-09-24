const express = require('express');
const cors = require('cors');
const getSortedBinanceData = require('./dataService')
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get ('/api/data' , async (req, res) => {
  try{
    const data = await getSortedBinanceData();
    res.json(data);
  }catch(error){
    res.status(500).send('An error occured')
  }
});

app.listen(port , () => {
  console.log(`Server is running on port ${port}`);
})