import { MyStocksSection } from "./components/MyStocksSection/MyStocksSection";
import { Stock } from "./components/Stock/Stock";
import { useEffect, useState } from "react";
import { PortfolioSummary } from "./components/PortfolioSummary/PortfolioSummary";
import axios from "axios";

function App() {
  //402880a079cfb78f0179cfb794320000
  const [userId, setUserId] = useState(null);
  const [stockSymbol, setStockSymbol] = useState(null);

  useEffect(() => {
    const f = async () => {
      try {
        const { data } = await axios.get(`users/defaultUser`);
        setUserId(data);
      } catch (e) {}
    };
    f();
  }, []);

  if (userId == null) return <h1>No user</h1>;

  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <MyStocksSection userId={userId} setStockSymbol={setStockSymbol} />
        {stockSymbol ? (
          <Stock
            userId={userId}
            stockSymbol={stockSymbol}
            setStockSymbol={setStockSymbol}
          />
        ) : (
          <PortfolioSummary userId={userId} />
        )}
      </div>
    </div>
  );
}

export default App;
