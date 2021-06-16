import React from "react";
import { render } from "@testing-library/react";
import { ListItem, SharesList } from "./SharesList";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import axios from "axios";

describe("SharesList", () => {
  let getByTestId;
  let getByText;
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

  describe("non empty share list", () => {
    let getByTestId;
    let queryByTestId;

    beforeEach(async () => {
      jest.spyOn(axios, "get").mockImplementation(() => {
        return Promise.resolve({ data: sharesList });
      });

      await act(async () => {
        ({ getByTestId, queryByTestId } = render(
          <SharesList userId={"test"} showGraph={false}/>
        ));
      });
    });

    it("should contain all the shares of the shareList state", () => {
      const shareListContainerElement = getByTestId("shareListContainer");
      expect(shareListContainerElement.children.length).toEqual(4);
    });

    it("should not show empty list message with a non empty list", () => {
      const emptyListContainerElement = queryByTestId(
        "emptyShareListContainer"
      );
      expect(emptyListContainerElement).toBeNull();
    });
  });

  describe("an empty share list", () => {
    let getByTestId;
    let shareListContainerElement;

    beforeEach(async () => {
      sharesList = [];
      ({ getByTestId } = render(<SharesList showGraph={false} />));
      shareListContainerElement = getByTestId("shareListContainer");
    });

    it("should contain a info text message when shareList state is empty", () => {
      const emptyListSpanElement = getByTestId("emptyShareListSpan");
      expect(emptyListSpanElement.textContent).toEqual("No shares");
    });
  });

  describe("first load of the shareList component", () => {
    let fakeData;
    let axiosSpy;

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

      axiosSpy = jest.spyOn(axios, "get").mockImplementation(() => {
        return Promise.resolve({ data: fakeData });
      });

      await act(async () => {
        ({ getByTestId, getByText } = render(<SharesList userId={"test"} showGraph={false}/>));
      });
    });

    it("should call the get axios function", () => {
      expect(axiosSpy).toBeCalled();
    });

    it("should have render the shares data after axios get function call succeed", async () => {
      const shareListContainerElement = getByTestId("shareListContainer");
      expect(shareListContainerElement.children.length).toEqual(2);
      expect(getByText(/AAPL/)).toBeInTheDocument();
      expect(getByText(/\$105.67/)).toBeInTheDocument();
      expect(getByText(/120 SHARES/)).toBeInTheDocument();
      expect(getByText(/TSLA/)).toBeInTheDocument();
      expect(getByText(/\$227.75/)).toBeInTheDocument();
      expect(getByText(/75 SHARES/)).toBeInTheDocument();
    });
  });
});

describe("ListItem", () => {
  let getByTestId;
  let mockShare = {
    stockSymbol: "AAPL",
    price: 105.67,
    stockPrices: [],
    sharesQuantity: 120,
    priceStatus: "DECREASED",
  };

  describe("a share on the list", () => {
    beforeEach(async () => {
      ({ getByTestId } = render(<ListItem share={mockShare} showGraph={false} />));
    });

    it("should have company name", () => {
      const shareNameElement = getByTestId("shareName");
      expect(shareNameElement.textContent).toEqual("AAPL");
    });

    it("should have share volume", () => {
      const shareQuantityElement = getByTestId("shareQuantity");
      expect(shareQuantityElement.textContent).toEqual("120 SHARES");
    });

    it("should have share price", () => {
      const sharePriceElement = getByTestId("sharePrice");
      expect(sharePriceElement.textContent).toEqual("$105.67");
    });

    it("should has a priceContainer with a className based on the priceStatus prop", () => {
      const sharePriceContainerElement = getByTestId("sharePriceContainer");
      expect(sharePriceContainerElement.className).toContain(
        "share-price-status-decreased"
      );
    });
  });

  describe("clicking a share on the list", () => {
    let onClick;

    beforeEach(async () => {
      onClick = jest.fn().mockName("onClick");

      ({ getByTestId } = render(
        <ListItem share={mockShare} onClick={onClick} showGraph={false} />
      ));

      userEvent.click(getByTestId("shareListItem"));
    });

    it("should call the onClick function", () => {
      expect(onClick).toBeCalled();
    });
  });
});
