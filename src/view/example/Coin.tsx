import {useEffect, useState} from 'react';

interface Coin {
  name: string;
  symbol: string;
  quotes: Quotes;
}

interface Quotes {
  USD: JSON;
}

const Coin = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://api.coinpaprika.com/v1/tickers')
    .then((resp) => resp.json())
    .then((json) => {
      setCoins(json);
      setLoading(false);
    })
  }, []);

  return (
    <div>
      <h1>The Coins!</h1>
      {loading ? 
        <strong>Loding...</strong> : 
        <ul>{coins.map((coin: Coin, idx) => <li key={idx}>{coin.name} ({coin.symbol}): {JSON.stringify(coin.quotes.USD)}</li>)}</ul>
      }
    </div>
  )
}

export default Coin;