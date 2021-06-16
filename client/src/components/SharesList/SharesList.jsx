import React, { useEffect, useState } from "react";
import "./SharesList.scss";
import axios from "axios";

export const ListItem = ({ share, onClick }) => {
  return (
    <div
      className={"list-item"}
      data-testid={"shareListItem"}
      onClick={onClick}
    >
      <div className={"share-name-and-volume-container"}>
        <span className={"share-name"} data-testid={"shareName"}>
          {share?.stockSymbol}
        </span>
        <span className={"share-quantity"} data-testid="shareQuantity">
          {share?.sharesQuantity + " SHARES"}
        </span>
      </div>
      <div
        className={
          "share-price-container " +
          `share-price-status-${share?.priceStatus.toLowerCase()}`
        }
        data-testid="sharePriceContainer"
      >
        <span className={"share-price"} data-testid="sharePrice">
          {"$" + share?.price}
        </span>
      </div>
    </div>
  );
};

const selectFilteredShares = (shares, searchInputText) => {
  return searchInputText === "" || searchInputText == null
    ? shares
    : shares.filter((share) =>
        share.stockSymbol.toLowerCase().includes(searchInputText.toLowerCase())
      );
};

export const SharesList = ({ userId, setStockSymbol, searchInput }) => {
  const [sharesList, setSharesList] = useState([]);

  useEffect(() => {
    const f = async () => {
      if (userId == null) return;
      try {
        const { data } = await axios.get(`users/${userId}/shares`);
        setSharesList(data);
      } catch (e) {}
    };
    f();
  }, [userId]);

  return (
    <div className={"list-container"} data-testid="shareListContainer">
      {sharesList?.length > 0 ? (
        selectFilteredShares(sharesList, searchInput).map((share) => (
          <ListItem
            key={"share-list-item-" + share.stockSymbol}
            share={share}
            onClick={() => setStockSymbol(share.stockSymbol)}
          />
        ))
      ) : (
        <div
          className={"empty-list-message-container"}
          data-testid="emptyShareListContainer"
        >
          <span
            className={"empty-list-message"}
            data-testid="emptyShareListSpan"
          >
            No shares
          </span>
        </div>
      )}
    </div>
  );
};
