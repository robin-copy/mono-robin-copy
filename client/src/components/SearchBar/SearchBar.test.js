import { SearchBar } from "./SearchBar";
import { render } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";

describe(SearchBar, () => {
  let getByTestId;
  let onChange;

  beforeEach(async () => {
    onChange = jest.fn().mockName("onChange");
    ({ getByTestId } = render(<SearchBar onChange={onChange} />));
  });

  describe("typing TSLA", () => {
    let searchInputElement;
    beforeEach(async () => {
      searchInputElement = getByTestId("searchInput");
      await userEvent.type(searchInputElement, "TSLA");
    });
    it("should display TSLA", async () => {
      expect(searchInputElement.value).toBe("TSLA");
    });

    it("should call onChange with TSLA", async () => {
      expect(onChange).toHaveBeenCalledWith("TSLA");
    });
  });

  describe("removing text", () => {
    let searchInputElement;

    beforeEach(async () => {
      searchInputElement = getByTestId("searchInput");
      await userEvent.type(searchInputElement, "TSLA");
      await userEvent.clear(searchInputElement);
    });

    it("should display no value", () => {
      expect(searchInputElement.value).toBe("");
    });
    it("should call onChange with empty text", async () => {
      expect(onChange).toHaveBeenCalledWith("");
    });

    describe("writing more than 20 characters", () => {
      let searchInputElement;

      const maxText = "qwertyiopasdfghjklzx";

      beforeEach(async () => {
        searchInputElement = getByTestId("searchInput");
        await userEvent.type(searchInputElement, `${maxText}cvbnm`);
      });

      it("should call onChange with 20 characters", async () => {
        expect(onChange).toHaveBeenCalledWith(maxText);
      });
    });
  });
});
