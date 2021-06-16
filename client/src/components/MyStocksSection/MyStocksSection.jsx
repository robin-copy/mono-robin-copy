import React, { useState } from "react";
import "./MyStocksSection.scss";
import { SearchBar } from "../SearchBar/SearchBar";
import { SharesList } from "../SharesList/SharesList";

export const MyStocksSection = ({ userId, setStockSymbol }) => {
  const [searchInput, setSearchInput] = useState("");
  return (
    <div className={"stock-section"}>
      <SearchBar searchInputText={searchInput} onChange={setSearchInput} />
      <SharesList
        userId={userId}
        setStockSymbol={setStockSymbol}
        searchInput={searchInput}
      />
    </div>
  );
};
