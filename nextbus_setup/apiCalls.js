/* This operation can be called directly, not dependencies */

const axios = require("axios");
const sleep = require("sleep");

const { writeJSON } = require("./jsonIO.js");

const dir = "nextbus_setup/";
const schedulesDir = dir + "schedules/";
const routesDir = dir + "routeData/";
let agency = "sf-muni";
let schedule = false;
let routes = false;

try {
  agency = process.argv[2];
} catch (err) {
  console.log("No agency selected, using sf-muni as default");
}
try {
  if (process.argv[3] === "schedule") schedule = true;
  else if (process.argv[3] === "routes") routes = true;
} catch (err) {
  console.log(`you have selected to not save any data, to save run: 
  node [dir]/apiCalls.js (service) (schedule|routes)`);
}

const API_URL = `http://webservices.nextbus.com/service/publicJSONFeed?a=${agency}`;

const getRoutes = (expanded = false, schedule = false) => {
  let result;
  result = axios
    .get(API_URL, { params: { command: "routeList" } })
    .then(response => {
      let counter = 1;
      response.data.route.map(({ tag }) => {
        console.log(
          `Processing ${counter} of ${response.data.route.length}: ${tag}`
        );

        // if there are issues with sleep, use the below instead
        // let waitTill = new Date(new Date().getTime() + 1500)
        // while(waitTill > new Date()){}
        if (expanded) {
          sleep.sleep(1);
          getExpandedRoute(tag);
        } else if (schedule) {
          sleep.sleep(2);
          getSchedules(tag);
        }
        counter += 1;
      });
      writeJSON(`${route}routeIndex.json`, response.data);
    })
    .catch(err => {
      console.log("========ERROR======");
      console.log(err);
    });
  return result;
};

const getExpandedRoute = route => {
  axios
    .get(API_URL, { params: { command: "routeConfig", r: route } })
    .then(response => {
      writeJSON(`${routesDir}${route}.json`, response.data);
      console.log(response.data);
    })
    .catch(err => console.log(err));
};

const getRouteSchedules = route => {
  axios
    .get(API_URL, { params: { command: "schedule", r: route } })
    .then(response => {
      writeJSON(`${schedulesDir}${route}.json`, response.data);
    })
    .catch(err => console.log(err));
};

getRoutes(routes, schedule);
