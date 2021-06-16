import { MyStocksSection } from "./MyStocksSection";
import { render } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

describe("MyStocksSection", () => {
  describe("when user writes TSLA in search bar", () => {
    let comp;
    let fakeData;
    let axiosSpy;
    let searchInputElement;

    beforeEach(async () => {
      fakeData = [
        {
          stockSymbol: "AAPL",
          price: 105.67,
          stockPrices: [],
          sharesQuantity: 120,
          priceStatus: "DECREASED",
        },
        {
          stockSymbol: "TSLA",
          price: 227.75,
          stockPrices: [],
          sharesQuantity: 75,
          priceStatus: "EQUAL",
        },
      ];

      const setStockSymbol = jest.fn().mockName("setStockSymbol");

      axiosSpy = jest.spyOn(axios, "get").mockImplementation(() => {
        return Promise.resolve({ data: fakeData });
      });
      await act(async () => {
        comp = render(
          <MyStocksSection userId={"test"} setStockSymbol={setStockSymbol} showGraph={false}/>
        );
      });
      searchInputElement = comp.getByTestId("searchInput");

      await userEvent.type(searchInputElement, "TSLA");
    });

    it("should display only one share", () => {
      const shareListContainerElement = comp.getByTestId("shareListContainer");
      expect(shareListContainerElement.children.length).toEqual(1);
      expect(comp.getByText("TSLA")).toBeInTheDocument();
      expect(comp.getByText(/75 SHARES/i)).toBeInTheDocument();
      expect(comp.getByText(/\$227\.75/i)).toBeInTheDocument();
    });
  });

  describe("when user writes TSLA in search bar and then clears it", () => {
    let comp;
    let axiosSpy;
    let searchInputElement;

    beforeEach(async () => {
      let sharesList = [
        {
          stockSymbol: "AAPL",
          price: 105.67,
          stockPrices: [],
          sharesQuantity: 120,
          priceStatus: "DECREASED",
        },
        {
          stockSymbol: "TSLA",
          price: 227.75,
          stockPrices: [],
          sharesQuantity: 75,
          priceStatus: "EQUAL",
        },
        {
          stockSymbol: "FB",
          price: 113.05,
          stockPrices: [],
          sharesQuantity: 110,
          priceStatus: "INCREASED",
        },
        {
          stockSymbol: "OTHE",
          price: 113.05,
          stockPrices: [],
          sharesQuantity: 110,
          priceStatus: "INCREASED",
        },
      ];

      const setStockSymbol = jest.fn().mockName("setStockSymbol");

      axiosSpy = jest.spyOn(axios, "get").mockImplementation(() => {
        return Promise.resolve({ data: sharesList });
      });
      await act(async () => {
        comp = render(
          <MyStocksSection userId={"test"} setStockSymbol={setStockSymbol} showGraph={false} />
        );
      });
      searchInputElement = comp.getByTestId("searchInput");

      await userEvent.type(searchInputElement, "TSLA");

      userEvent.clear(searchInputElement);
    });

    it("should contain all the shares", () => {
      const shareListContainerElement = comp.getByTestId("shareListContainer");
      expect(shareListContainerElement.children.length).toEqual(4);
    });
  });
});
