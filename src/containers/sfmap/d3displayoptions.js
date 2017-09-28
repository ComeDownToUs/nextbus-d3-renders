export const d3Defaults = {
  classPrefix: "d3 ",
  stroke: "rgba(0,0,0,0.4)",
  strokeWidth: "1",
  fill: "none",
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
  strokeWidth: "6",
  fill: "none",
  keyID: "tag"
};

export const selectedRouteOptions = {
  ...d3Defaults,
  strokeWidth: 20,
  strokeOpacity: 1,
  outerClass: "selected-route"
};

export const neighborhoodOptions = {
  ...d3Defaults,
  classPrefix: "neighborhood neigh-",
  stroke: "rgba(0,0,0,1)",
  strokeWidth: "0",
  fill: "rgba(200,255,200,1)",
  outerClass: "neighborhoods",
  keyID: "neighborho"
};

export const busOptions = {
  ...d3Defaults,
  classPrefix: "buses bus-",
  stroke: "rgba(0,0,0,1)",
  strokeWidth: "25",
  outerClass: "livedata"
};
