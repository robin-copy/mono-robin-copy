import React, {useEffect, useState} from "react";
import "./SharesList.scss";
import axios from "axios";
import {Line} from "react-chartjs-2";

const StockGraph = (info) => {
    if (!info) {
        return;
    }
    const data = info.map((x) => x.price).reverse();
    const labels = info.map((x) => x.date).reverse();
    const customData = {
        labels: labels,

        datasets: [{
                label: {
                    display: false,
                },
                data: data,
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
            }],
    };

    const options = {
        scaleShowLabels: false,
        legend: {
            display: false,
        },
        omitXLabels: true,
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }],
            yAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }

    return (
        <div>
            <Line data={customData} options={options} width={10} height={10} type={"line"}/>
        </div>
    );
};

export const ListItem = ({share, onClick, showGraph = true}) => {
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
            <div>
                <div className={"graph"}>
                    {showGraph && StockGraph(share?.stockPrices)}
                    <div>Data display actions:</div>
                </div>
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

export const SharesList = ({userId, setStockSymbol, searchInput, showGraph=true}) => {
    const [sharesList, setSharesList] = useState([]);

    useEffect(() => {
        const f = async () => {
            if (userId == null) return;
            try {
                const {data} = await axios.get(`users/${userId}/shares`);
                setSharesList(data);
            } catch (e) {
            }
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
                        showGraph={showGraph}
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
