import React, { useEffect, useState } from "react";
import "./Stock.scss";
import { Line } from "react-chartjs-2";
import axios from "axios";

/**
 * 1 [X] Debe mostrar la cotización de la acción en el momento con la diferencia del día.  A la derecha debe mostrar el nombre de la empresa.
 2 - La diferencia de rentabilidad en el día estará en color:
 a - Rojo: En el caso que el porcentaje de rentabilidad sea negativo.
 b - Verde: En el caso que el porcentaje de rentabilidad sea positivo.
 c -  Gris: En el caso que el porcentaje de rentabilidad sea cero.
 3 - [X] Se debe mostrar la cotización actual de la acción.
 4 -Se debe mostrar un gráfico con la variación diaria en la cotización.
 Debe tener la opción de pedir la visualización de
 la variación en la cotización por semana, por mes,
 por medio año y un año.
 5- Debe haber una tabla con las estadísticas de la acción.
 a - Open: el valor con el que abrió la acción en la bolsa.
 b - High: el valor máximo que tomó la acción en el día.
 c - Low: el valor mínimo que tomó la acción en el día.
 d - 52wk high: el valor máximo que tomó la acción en las últimas 52 semanas.
 e - 52wk low: el valor mínimo que tomó la acción en las últimas 52 semanas.
 f - Volume: la cantidad de títulos negociados de la acción en el día.
 g - Avg volume: el volumen medio de las acciones negociadas en las últimas 52 semanas.
 h - Mkt cap: la dimensión económica de la empresa.
 i - P/E ratio: el ratio de la empresa (la cotización del momento de la empresa dividido las ganancias reportadas en los últimos cuatro trimestres).
 j - Div/Yield: el rendimiento por dividendo.
 6- [X] Debe aparecer un cuadro con información de la empresa.
 7- Arriba deberá aparecer una cruz para salir de la visualización de la acción específica.


 */

const RenderLineChart = (info, customData, buttonAction) => {
  if (!info) {
    return;
  }
  return (
    <div style={{ maxWidth: "100%" }}>
      <Line data={customData} width={700} height={400} type={"line"} />
      <div>
        <div>Select range:</div>

        <button className="button" onClick={() => buttonAction(6)}>1 week</button>
        <button className="button" onClick={() => buttonAction(30)}>1 month</button>
        <button className="button" onClick={() => buttonAction(30*6)}>6 months</button>
        <button className="button" onClick={() => buttonAction(363)}>1 year</button>
      </div>
    </div>
  );
};

export const Stock = ({
  showChart = true,
  stockSymbol,
  userId,
  setStockSymbol,
}) => {
  const [stock, setStock] = useState(null);

  const [customData, setCustomData] = useState([]);


  const dateFormatter = (stockDate) => {
      let formattedData;
      const date = new Date(stockDate.date * 1000);
      formattedData = date.getDate() + '/' + date.getMonth() + '/' + date.getUTCFullYear().toString().slice(2,4);
      return formattedData;
  }

  const handleButtonOnClick = (value) => {
    const updatedData = stock.stockPrices.slice(0, value).map(x => x.price).reverse();
    const updatedLabels = stock.stockPrices.slice(0, value).map(x => dateFormatter(x)).reverse()

    const newData = {
      labels: updatedLabels,
      datasets: [
        {
          label: "price",
          data: updatedData,
          fill: false,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };

    setCustomData(newData);
  }

  useEffect(() => {
    setStock(null);
    (async () => {
      if (userId == null || stockSymbol == null) return;
      const { data } = await axios.get(
        `/users/${userId}/shares/${stockSymbol}`
      );
      const newChartData = data.stockPrices.map((x) => x.price).reverse();
      const newChartLabels = data.stockPrices.map((x) => dateFormatter(x)).reverse();

      const newData = {
        labels: newChartLabels,
        datasets: [
          {
            label: "price",
            data: newChartData,
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };

      setCustomData(newData);
      setStock(data);
    })();
  }, [stockSymbol, userId]);

  const handleCrossClicked = () => {
    setStockSymbol(null);
  };
  return (
    <div className={"stock"}>
      <div className={"header"}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{fontWeight: "bold"}}>Stock value: {stock?.price}</span>
          <button onClick={handleCrossClicked} className={'cross-button'} data-testid="cross-button">
            X
          </button>
        </div>
        <div className={"sub-header2"}>
          <span style={{color: stock?.dayProfit > 0? "green" : "red", fontWeight: "bold" }}>Diff: {stock?.dayProfit} %</span>
          <span data-testid="company">Company: {stock?.companyName}</span>
        </div>
      </div>
      <div className={"graph"}>
        {showChart && RenderLineChart(stock?.stockPrices, customData, handleButtonOnClick)}
      </div>
      <div className={"body"}>
        <div style={{ width: "50%" }}>
          <h3>stats</h3>
          <div className={"table"} aria-label={"table"}>
            <ul className={"stock-value-data"}>
              <li aria-label={"list-element"}>Open: {stock?.openValue}</li>
              <li aria-label={"list-element"}>High: {stock?.dayHigh}</li>
              <li aria-label={"list-element"}>Low: {stock?.dayLow}</li>
              <li aria-label={"list-element"}>52w high: {stock?.yearHigh}</li>
              <li aria-label={"list-element"}>52w low: {stock?.yearLow}</li>
            </ul>
            <ul className={"stock-volume-data"}>
              <li aria-label={"list-element"}>Volume: {stock?.volume}</li>
              <li aria-label={"list-element"}>
                Avg volume: {stock?.avgVolume}
              </li>
              <li aria-label={"list-element"}>Mkt cap: {stock?.marketCap}</li>
              <li aria-label={"list-element"}>P/E ratio: {stock?.peRatio}</li>
              <li aria-label={"list-element"}>Div/yield: {stock?.divYield}</li>
            </ul>
          </div>
        </div>
        <div className={"description"}>
          <span>{stock?.companyDescription}</span>
        </div>
      </div>
    </div>
  );
};
