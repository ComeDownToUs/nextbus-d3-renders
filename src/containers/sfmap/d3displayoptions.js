export const d3Defaults = {
  classPrefix: "d3 ",
  outerClass: "classReqd",
  text: false,
  mouseOver: () => {}
};

export const streetOptions = {
  ...d3Defaults,
  outerClass: "streets",
  classPrefix: "street street-",
  keyID: "STREET"
};

export const routeOptions = {
  ...d3Defaults,
  outerClass: "routes",
  classPrefix: "route route-",
  customStroke: true,
  keyID: "tag"
};

export const selectedRouteOptions = {
  ...d3Defaults,
  outerClass: "selected-route",
  classPrefix: "route",
  customStroke: true
};

export const neighborhoodOptions = {
  ...d3Defaults,
  classPrefix: "neighborhood neigh-",
  outerClass: "neighborhoods",
  keyID: "neighborho"
};

export const busOptions = {
  ...d3Defaults,
  classPrefix: "bus ",
  outerClass: "live-data",
  isBus: true,
};
