/* This script requires the data from the apiCalls script */

const { readJSON, writeJSON } = require('./jsonIO.js')

const dir = 'nextbus_setup'
const routeDataDir = dir+'/routeData'
const aggregatedDir = dir+'/aggregatedData'
const stopPoints = {}
const abbreviatedRoutes = {}

const parseCoordinates = (coordinates) => {
  return [
    parseFloat(coordinates[0]),
    parseFloat(coordinates[1]),
  ]
}

const getRouteTags = (directory) => {
  const routesJson = readJSON(`${routeDataDir}/index.json`)
  console.log(routesJson)
  const routeTags = routesJson.route.map((route) => route.tag)  
  return routeTags
}

const addNewStops = (stops) => {
  let duplicateCounter = 0
  stops.map((stop) => {
    if(!stopPoints[ stop.stopId ])
      stopPoints[ stop.stopId ] = stop
    else{
      duplicateCounter += 1
    }
  })
  console.log('Number of duplicate stops ommitted: '+duplicateCounter)
}

const getRouteStopPoints = (directory, routeTag) => {
  console.log(routeTag)
  try {
    const routeJson = readJSON(`${directory}/${routeTag}`+'.json', 'utf8')
    addNewStops(routeJson.route.stop)
    abbreviatedRoutes[routeJson.route.tag] = {
      title: routeJson.route.title,
      color: routeJson.route.color,
      tag: routeJson.route.tag,
      oppositeColor: routeJson.route.oppositeColor,
      max: parseCoordinates([routeJson.route.latMax, routeJson.route.lonMax]),
      min: parseCoordinates([routeJson.route.latMin, routeJson.route.lonMin]),
      stops: routeJson.route.stop.map(stop => stop.stopId)
    }
  }
  catch(err) {
    console.log('No data found for route '+routeTag)
  }
}

const rTags = getRouteTags(routeDataDir)
console.log('============'+rTags.length)
rTags.map( tag  => getRouteStopPoints(routeDataDir, tag))

writeJSON(`${aggregatedDir}/stops.json`, stopPoints)
writeJSON(`${aggregatedDir}/routes.json`, abbreviatedRoutes)
