import React, { useEffect, useState } from "react";
import "./PortfolioSummary.scss";
import axios from "axios";

export const PortfolioSummary = ({ userId }) => {
  const [portfolioSummary, setPortfolioSummary] = useState({
    balance: 0,
    increasePercentage: 0,
    stocksInfo: [],
  });

  useEffect(() => {
    const f = async () => {
      if (userId == null) return;
      try {
        const { data } = await axios.get(`users/${userId}/summary`);
        setPortfolioSummary(data);
      } catch (e) {}
    };
    f();
  }, [userId]);

  const percentageStatus = () => {
    if (portfolioSummary.increasePercentage === 0) return "zero";
    if (portfolioSummary.increasePercentage > 0) return "positive";
    return "negative";
  };

  return (
    <div className={"portfolio-summary"} data-testid={"portfolioSummary"}>
      {portfolioSummary?.stocksInfo.length > 0 ? (
        <div className={"all-data"} data-testid={"allData"}>
          <div className={"total-data"} data-testid={"totalData"}>
            <div className={"balance-container summary-container"}>
              <span className={"total-balance label"}>Total balance </span>
              <span
                className={"total-balance-number number"}
                data-testid={"totalBalance"}
              >
                {"$" + portfolioSummary?.balance.toFixed(2)}
              </span>
            </div>
            <div className={"increase-percentage-container summary-container"}>
              <span className={"increase-percentage-label label"}>
                Increase percentage{" "}
              </span>

              <div
                className={
                  "number increase-percentage-number-container " +
                  `status-${percentageStatus()}`
                }
              >
                <span
                  className={"increase-percentage"}
                  data-testid={"increasePercentage"}
                >
                  {portfolioSummary?.increasePercentage.toFixed(2) + "%"}
                </span>
              </div>
            </div>
          </div>
          <ShareList shareList={portfolioSummary?.stocksInfo} />
        </div>
      ) : (
        <div
          className={"empty-data-message-container"}
          data-testid="emptyDataContainer"
        >
          <span className={"empty-data-message"} data-testid="emptyDataSpan">
            Es necesario poseer acciones para poder generar un resumen
          </span>
        </div>
      )}
    </div>
  );
};

export const ShareList = (props) => {
  const { shareList } = props;
  return (
    <div className={"list-container"} data-testid={"shareListContainer"}>
      {shareList.map((share) => (
        <ShareItem key={"share-list-item-" + share.stockSymbol} share={share} />
      ))}
    </div>
  );
};

export const ShareItem = (share) => {
  return (
    <div className={"list-item"} data-testid={"shareItem"}>
      <div className={"shareNameContainer"}>
        <span className={"share-name"} data-testid={"shareName"}>
          {share?.share.stockSymbol}
        </span>
        <span className={"share-quantity"} data-testid={"shareQuantity"}>
          {share?.share.quantity + " SHARES"}
        </span>
      </div>
      <div className={"shareInformation"}>
        <span className={"share-last-price"} data-testid={"shareLastPrice"}>
          {"Last price: $" + share?.share.lastPrice.toFixed(2)}
        </span>
        <span
          className={"share-daily-variation-percentage"}
          data-testid={"shareDailyVariationPercentage"}
        >
          {"Daily variation percentage: " +
            share?.share.dailyVariationPercentage.toFixed(2) +
            "%"}
        </span>
        <span
          className={"share-daily-variation"}
          data-testid={"shareDailyVariation"}
        >
          {"Daily variation: " + share?.share.dailyVariation.toFixed(2)}
        </span>
        <span
          className={"share-total-variation"}
          data-testid={"shareTotalVariation"}
        >
          {"Total variation: " + share?.share.totalVariation.toFixed(2)}
        </span>
        <span className={"share-total-wining"} data-testid={"shareTotalWining"}>
          {"Total wining: $" + share?.share.totalWining.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
