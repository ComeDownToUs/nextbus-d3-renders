/* This operation can be requires:
  - apiCalls to be called for Route Paths
  - apiCalls and buildStopData for Stop Points  */

const { readJSON, writeJSON } = require('./jsonIO.js')


const stopPoints = {type: 'FeatureCollection', features: []}
const routePaths = {type: 'FeatureCollection', features: []}
const dir = 'nextbus_setup/'
const routeDataDir = dir+'routeData/'
const aggregatedDir = dir+'aggregatedData/'

const buildStopPoints = (directory) => {
  stopJson = readJSON(`${directory}aggregatedData/stops.json`)
  for(let i in stopJson){
    console.log(i)
    stopPoints.features.push({
      type: 'Feature',
      properties: {
        title: stopJson[i].title,
      },
      geometry: {
        type: 'Point',
        coordinates: [  
          parseFloat(stopJson[i].lon),
          parseFloat(stopJson[i].lat)
        ]
      }
    })
  }
  writeJSON(`${directory}geoJSONS/stops.geojson`, stopPoints)
}

const getLineStrings = routePath => {
  return routePath.map(points => {
    const geoPath = points.point.map(point => {
      return [
        parseFloat(point.lon),
        parseFloat(point.lat), 
      ]
    })
    return geoPath
  })
}

const buildRoutes = (directory) => {
  routesJson = readJSON(`${directory}routeData/index.json`)
  routesJson.route.map(route => {
    const routeJson = readJSON(`${directory}routeData/${route.tag}.json`)
    routePaths.features.push({
      type: 'Feature',
      properties: {
        title: routeJson.route.title,
        tag: routeJson.route.tag,
        color: routeJson.route.color,
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: getLineStrings(routeJson.route.path)
      }
    })
  })
  writeJSON(`${directory}geoJSONS/routePaths.geojson`, routePaths)
}

buildRoutes(dir)
buildStopPoints(dir)
