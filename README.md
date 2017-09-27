This repo was bootstrapped with Create React App and used [this Medium tutorial](https://medium.com/@notrab/getting-started-with-create-react-app-redux-react-router-redux-thunk-d6a19259f71f) to set up Redux and React-Router v4.

### Table of Contents

- Core App
  - [Initialization](#initialization)
  - [Things I'd Change](#things-id-change)
- NextBus API Toolset
  - [Motive](#movite)
  - [Available scripts](#available-scripts)
  - [Issues and Notes](#issues-and-notes)

# Core App

## Initialization

Currently just run `npm run start`
The NextBus Scripts below will likely be needed to be ran first at a later stage so as to set up the environment

## Things I'd Change

This is something I'll fill in as I make compromises for convenience

- Only install relevant D3 modules: I'm not familiar enough with D3 to know what I'd need other than D3 Geo at the moment
- Use topojson for initial setup files to reduce the load
- Use the listed stops from schedule requests in routes view as the actual returned stops are useless. Possibly genereate those stops into default json instead?

# NextBus API Toolset

## Motive
I noticed that the API didn't provide any means to gather stops and that individual route requests were pretty large to the point a use could potentially hit the request limit. As I didn't want to abuse the API with request, I built some scripts to gather data and condense it so the app will load with all the (relatively) static data.

## Available Scripts

`npm run nextbus_api_reqs` will fetch all SF Muni routes and store them in individual JSON files, this includes all stop information and a thorough collection of coordinates for their path

`npm run nextbus_aggregated` will aggregate all of the stops from the list of routes, removing repeat entries, these are stored within a json file with their relative tags as the keys. Following that, the routes are collected together into a much smaller file by gathering everything from the individual route, removing the paths and all stop data other than than ID

`npm run nextbus_geojsons` will build geojson files for all route paths and all stops, this requires both of the aforementioned scripts data to have been generated

`npm run nextbus_setup` runs all of the above in order, I'd recommend against using it at the moment as the api reqs aren't 100% stable

All of these can be reused for any other region and I'll probably move them into a script of their own and tidy it all up

## Issues

The API requests script currently uses the [npm sleep package](https://www.npmjs.com/package/sleep) between each request to stop the API from hitting the 20 second limit. I gather this package has issues on some machines so I might replace it with something else.
