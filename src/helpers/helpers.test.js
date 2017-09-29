import {
  splitPath,
  routeParser,
  getRouteObject,
  parseQueryString
} from "./routeParser";

describe("splits path correctly", () => {
  it("splits with blank strings omitted", () => {
    let split = splitPath("/route/string?xxx#");
    expect(split).toEqual(["/", "route", "/", "string", "?", "xxx", "#"]);
  });
});

describe("query strings", () => {
  it("returns query string object", () => {
    let qs = parseQueryString("a=x&b=c&c");
    expect(qs).toEqual({
      a: "x",
      b: "c",
      c: true
    });
  });
  it("returns numbers as strings", () => {
    let qs = parseQueryString("a=123&b=345&c");
    expect(qs).toEqual({
      a: "123",
      b: "345",
      c: true
    });
  });
});

describe("route object processing", () => {
  let expected = {
    dir: "route",
    id: "13",
    anchorTag: "heading",
    queries: {
      a: "123",
      b: true
    }
  };
  it("processes", () => {
    expect(routeParser("/route/13?a=123&b#heading")).toEqual(expected);
  });
});

describe("simple route process", () => {
  let expected = {
    dir: "route",
    id: "13"
  };
  it("processes", () => {
    expect(routeParser("/route/13")).toEqual(expected);
  });
});
