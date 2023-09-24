const axios = require('axios');

async function getSortedBinanceData(limit = 140){
    try{
        const response = await axios.get('http://www.binance.com/api/v3/ticker/bookTicker');
        if(Array.isArray(response.data)){
            const sortedData = response.data.map(item => ({
                ...item,
                ratio: parseFloat(item.askPrice) / parseFloat(item.bidPrice),
            })).filter(item => !isNaN(item.ratio)).sort((a,b) => b.ratio- a.ratio);
            return sortedData.slice(0, 200);
        } else {
            console.error('Expected an array but received', response.data);
        }
    } catch (error) {
        console.error('Could not fetch data from Binance API', error)
    }
}

module.exports = getSortedBinanceData;