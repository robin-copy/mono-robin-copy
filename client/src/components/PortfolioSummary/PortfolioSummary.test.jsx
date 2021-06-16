import React from "react";
import {PortfolioSummary, ShareItem, ShareList} from './PortfolioSummary'
import {act, render} from "@testing-library/react";
import axios from "axios";

describe("PortfolioSummary", () => {

    let getByTestId;
    let queryByTestId;
    let portfolioSummary;


    describe("empty data", () => {
        let getByTestId;
        let stockInformationListElement;
        let emptyPortfolioSummary = {
            balance: 0,
            increasePercentage: 0,
            stocksInfo: []
        }

        beforeEach(async () => {
            jest.spyOn(axios, "get").mockImplementation(() => {
                return Promise.resolve({data: emptyPortfolioSummary})
            })
            await act(async () => {
                ({getByTestId} = render(<PortfolioSummary userId={"test"}/>))
                stockInformationListElement = getByTestId("portfolioSummary");
            })
        });

        it("should contain a message when shareList prop is empty", () => {
            const emptyListSpanElement = getByTestId("emptyDataSpan");
            expect(emptyListSpanElement.textContent).toEqual("Es necesario poseer acciones para poder generar un resumen");
        })
    })

    describe("Portfolio summary with data", () => {

        portfolioSummary = {
            balance: 3117.0,
            increasePercentage: 1.2012987012986969,
            stocksInfo: [
                {
                    stockSymbol: "TSLA",
                    quantity: 5,
                    lastPrice: 124.28,
                    dailyVariationPercentage: -0.26552944962986663,
                    dailyVariation: -0.32999999999999824,
                    totalVariation: 3.4438364982298046,
                    totalWining: 20.66301898937883
                },
                {
                    stockSymbol: "AAPL",
                    quantity: 4,
                    lastPrice: 623.9,
                    dailyVariationPercentage: -0.21157236736657317,
                    dailyVariation: -1.32000000000005,
                    totalVariation: 0.6251001763103026,
                    totalWining: 15.502484372495504
                }
            ]
        }

        beforeEach(async () => {
            jest.spyOn(axios, "get").mockImplementation(() => {
                return Promise.resolve({data: portfolioSummary})
            })
            await act(async () => {
                ({getByTestId, queryByTestId} = render(<PortfolioSummary userId={"test"}/>));
            });
        });

        it('should contain 2 stocks data', () => {
            const stockInformationListElement = getByTestId("shareListContainer");
            expect(stockInformationListElement.children.length).toEqual(2)
        });

        it('should contain balance data', () => {
            const totalBalanceElement = getByTestId("totalBalance");
            expect(totalBalanceElement.textContent).toEqual("$3117.00")
        });

        it('should contain increase percentage data', () => {
            const increasePercentageElement = getByTestId("increasePercentage");
            expect(increasePercentageElement.textContent).toEqual("1.20%")
        });

        it('should not contain "no stock" message ', () => {
            const emptyListSpanElement = queryByTestId("emptyDataSpan");
            expect(emptyListSpanElement).toBeNull();
        });
    })
})

describe("ShareList", () => {
    let getByTestId;
    let queryByTestId;
    let stocksInfo;

    describe("ShareList with 2 stocks", () => {

        stocksInfo = [
            {
                stockSymbol: "TSLA",
                quantity: 5,
                lastPrice: 124.28,
                dailyVariationPercentage: -0.26552944962986663,
                dailyVariation: -0.32999999999999824,
                totalVariation: 3.4438364982298046,
                totalWining: 20.66301898937883
            },
            {
                stockSymbol: "AAPL",
                quantity: 4,
                lastPrice: 623.9,
                dailyVariationPercentage: -0.21157236736657317,
                dailyVariation: -1.32000000000005,
                totalVariation: 0.6251001763103026,
                totalWining: 15.502484372495504
            }
        ]

        beforeEach(async () => {
            ({getByTestId, queryByTestId} = render(<ShareList shareList={stocksInfo}/>
            ));
        });

        it('should contain 2 stocks data', () => {
            const stockInformationListElement = getByTestId("shareListContainer");
            expect(stockInformationListElement.children.length).toEqual(2)
        });
    })
});

describe("Share", () => {
    let getByTestId;
    let mockShare;

    mockShare = {
        stockSymbol: "TSLA",
        quantity: 5,
        lastPrice: 124.28,
        dailyVariationPercentage: -0.26552944962986663,
        dailyVariation: -0.32999999999999824,
        totalVariation: 3.4438364982298046,
        totalWining: 20.66301898937883
    }

    describe("a share on the list", () => {
        beforeEach(async () => {
            ({getByTestId} = render(<ShareItem share={mockShare}/>));
        });

        it('should have company name', () => {
            const shareSymbol = getByTestId("shareName");
            expect(shareSymbol.textContent).toEqual("TSLA")
        });
        it('should have share quantity', () => {
            const shareQuantity = getByTestId("shareQuantity");
            expect(shareQuantity.textContent).toEqual("5 SHARES")
        });
        it('should have last share price', () => {
            const shareLastPrice = getByTestId("shareLastPrice");
            expect(shareLastPrice.textContent).toEqual("Last price: $124.28")
        });
        it('should have daily variation percentage', () => {
            const shareDailyVariationPercentage = getByTestId("shareDailyVariationPercentage");
            expect(shareDailyVariationPercentage.textContent).toEqual("Daily variation percentage: -0.27%")
        });
        it('should have daily variation share price', () => {
            const shareDailyVariation = getByTestId("shareDailyVariation");
            expect(shareDailyVariation.textContent).toEqual("Daily variation: -0.33")
        });
        it('should have daily variation share price', () => {
            const shareTotalVariation = getByTestId("shareTotalVariation");
            expect(shareTotalVariation.textContent).toEqual("Total variation: 3.44")
        });
        it('should have total shae wining', () => {
            const shareTotalWining = getByTestId("shareTotalWining");
            expect(shareTotalWining.textContent).toEqual("Total wining: $20.66")
        });
    })
});

