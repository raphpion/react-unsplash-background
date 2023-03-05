import { render } from "@testing-library/react";

import { buildUnauthorizedQueryUrl, UnsplashBackground } from ".";

console.error = jest.fn();
console.warn = jest.fn();

describe("UnsplashBackground", () => {
  describe("The component", () => {
    it("renders without warnings or errors", () => {
      render(<UnsplashBackground />);
      expect(console.warn).not.toBeCalled();
      expect(console.error).not.toBeCalled();
    });
  });
  describe("The controller", () => {
    describe("when fetching without authorization", () => {
      describe("when building a query url", () => {
        it("to be valid when no parameters are supplied", async () => {
          const result = buildUnauthorizedQueryUrl({});
          expect(result).toEqual("https://source.unsplash.com/random");
        });
        it("to be valid when a keyword is supplied", async () => {
          const result = buildUnauthorizedQueryUrl({ keywords: "test" });
          expect(result).toEqual("https://source.unsplash.com/random/?test");
        });
        it("to be valid when a photoId is supplied", async () => {
          const result = buildUnauthorizedQueryUrl({ photoId: "test" });
          expect(result).toEqual("https://source.unsplash.com/test");
        });
        it("to be valid when a collectionId is supplied", async () => {
          const result = buildUnauthorizedQueryUrl({ collectionId: "test" });
          expect(result).toEqual("https://source.unsplash.com/collection/test");
        });
        it("to be valid when a username is supplied", async () => {
          const result = buildUnauthorizedQueryUrl({ username: "test" });
          expect(result).toEqual("https://source.unsplash.com/user/test");
        });
      });
    });

    describe("when fetching with authorization", () => {

    });
  })
});