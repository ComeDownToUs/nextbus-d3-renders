export const splitPath = pathname => {
  const regX = /(\?|#|\/)/;
  return pathname.split(regX).filter(x => x !== "");
};

export const getRouteObject = splitArray => {
  const pathObj = { id: false };
  for (let i = 0; i < splitArray.length; i += 2) {
    if (splitArray[i] === "?") {
      pathObj.queries = parseQueryString(splitArray[i + 1]);
    } else if (splitArray[i] === "#") {
      pathObj.anchorTag = splitArray[i + 1];
    } else if (splitArray[i] === "/" && i === 0) {
      pathObj.dir = splitArray[i + 1];
    } else if (splitArray[i] === "/") {
      pathObj.id = splitArray[i + 1];
    }
  }
  return pathObj;
};

export const parseQueryString = queriesString => {
  const queries = {};
  queriesString.split("&").map(query => {
    if (query.indexOf("=") !== -1) {
      let splitQuery = query.split("=");
      queries[splitQuery[0]] = splitQuery[1];
    } else {
      queries[query] = true;
    }
  });
  return queries;
};

export const routeParser = pathname => {
  const splat = splitPath(pathname);
  const obj = getRouteObject(splat);
  return obj;
};
