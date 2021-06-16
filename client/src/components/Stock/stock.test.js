import React from "react";
import { render } from "@testing-library/react";
import { Stock } from "./Stock";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import {act} from "react-dom/test-utils";

test("renders company label", () => {
  const { getByText } = render(<Stock />);
  const linkElement = getByText(/company:/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders value label", () => {
  const { getByText } = render(<Stock />);
  const linkElement = getByText(/Stock value:/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders day diff label", () => {
  const { getByText } = render(<Stock />);
  const linkElement = getByText(/Diff:/i);
  expect(linkElement).toBeInTheDocument();
});

test("render aria label table", () => {
  const { getByLabelText } = render(<Stock />);
  const linkElement = getByLabelText(/table/i);
  expect(linkElement).toBeInTheDocument();
});

test("render list elements must be 10", () => {
  const { getAllByLabelText } = render(<Stock />);
  const linkElement = getAllByLabelText(/list-element/i);
  expect(linkElement.length).toEqual(10);
});

describe("<Stock />", () => {
  let getByTestId;

  describe("clicking the cross button", () => {
    let setStockSymbol;
    beforeEach(async () => {
      setStockSymbol = jest.fn().mockName("setStockSymbol");
      ({ getByTestId } = render(<Stock setStockSymbol={setStockSymbol} />));

      userEvent.click(getByTestId("cross-button"));
    });

    it("calls the function passed", () => {
      expect(setStockSymbol).toBeCalledWith(null);
    });
  });
});

describe("My stock data", () => {
  describe("when user get TSLA stock info", () => {
    let comp;
    let fakeData;
    let axiosSpy;

    beforeEach(async () => {


      const setStockSymbol = jest.fn().mockName("setStockSymbol");

      fakeData = {
        avgVolume: 36030110.515873015,
        companyDescription: "Tesla Inc is a Automobiles company. It's official site is https://www.tesla.com/",
        companyName: "Tesla Inc",
        dayHigh: 623.36,
        dayLow: 599.14,
        dayProfit: -60.039999999999964,
        dayVariationPercentage: -3.1035166578529836,
        divYield: 199,
        marketCap: 542798,
        openValue: 620.13,
        peRatio: 0.37342022116903634,
        price: 605.12,
        profit: 1620.48,
        profitPercentage: 202.56,
        stockPrices: [{price: 605.12, date: 1622592000}, {price: 623.9, date: 1622505600}],
        stockSymbol: "TSLA",
        yearHigh: 900.4,
        yearLow: 177.304,
      }

      axiosSpy = jest.spyOn(axios, "get").mockImplementation(() => {
        return Promise.resolve({ data: fakeData });
      });
      await act(async () => {
        comp = render(
            <Stock userId={"test"} stockSymbol={'TSLA'} setStockSymbol={setStockSymbol} showChart={false}/>
        );
      });
    });

    it("should display the correct data", () => {
      expect(comp.getByText(`Stock value: ${fakeData.price}`)).toBeInTheDocument();
      expect(comp.getByText(`Diff: ${fakeData?.dayProfit} %`)).toBeInTheDocument();
      expect(comp.getByText(`Company: ${fakeData.companyName}`)).toBeInTheDocument();
      expect(comp.getByText(`High: ${fakeData.dayHigh}`)).toBeInTheDocument();
    });
  });
});

