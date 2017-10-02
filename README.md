This repo was bootstrapped with Create React App and used [this Medium tutorial](https://medium.com/@notrab/getting-started-with-create-react-app-redux-react-router-redux-thunk-d6a19259f71f) to set up Redux and React-Router v4.

Note: For the purposes of this project, libraries such as leaflet JS which do a lot of the heavy lifting were banned

Due to the limitations of the API at hand, I build a set of scripts to pull down some data that doesn't fluctuate much, please read the motives section below for why. In this repository I've placed all the necessary (but flawed) data from these scripts in the src/sfmap folder along with the provided jsons of San Francisco

### Table of Contents

- Core App
  - [Initialization](#initialization)
  - [The Map Explained](#the-map-explained)
  - [Things I'd Change](#things-id-change)
- NextBus API Toolset
  - [Motive](#movite)
  - [Available scripts](#available-scripts)
  - [Issues and Notes](#issues-and-notes)

# Core App

## Initialization

Currently just run `npm run start`
The NextBus Scripts below will likely be needed to be ran first at a later stage so as to set up the environment

## The Map Explained

### The elements

The Provided JSON files
- Neighborhoods: Seemed like unnecessary additional lines on the map, so I used this json just for the outline
- Streets: Super thin outlines, just to orient the user really
- Freeways: Every styling option I tried just seemed to confuse things, so I ommitted them
- Arteries: Ommitted in favour of the built routes

Custom designed files
- Stops: Derived from each routes returned details in the API with duplicates removed, unfortunately a bit of a mess due to the sheer number so I've ommitted them, but may be useful on route viewing page
- Routes: Pulled from the API and stipped down to reduce file size, these replace the arteries and, while having some clear flaws (overlapping colors in particular), give the map an intuitive usability for experienced users

Both custom files use the IDs provided as keys for quick reference

### How the map works

As it stands currently, the maps various parts are generated within two functions with the assistance of some options objects in the same directory. I'm pretty confident large parts of these two functions could be heavily merged together with someone more experienced using D3 and React together. 
The primary focus of the map on viewing is to see all of the various route options in the bay area, every route is highlightable (displaying some data about the route) and links to a /route page. On the route page you have access to greater detail information about the route as well as a live tracker of buses/trains on the route currently.

Styling on the map is overwhelmingly done using SASS, w/e of routes as they have an attribute in the dataset. In an attempt to compensate for the overlapping of routes, they have low opacity unless highlighted, this does not help near embarcadero, however.

Live locations of buses are currently using paths but really should be using points. As there seemed to be inactive buses in the feed, they've been styled to appear more prominent when a bus has a speed greater than 0.

## Things I'd Change

This is something I'll fill in as I make compromises for convenience

Technical
- Resolve D3 React child component issues (current lags and stalling, also perhaps an excess of props passed through)
- Pan and Zoom
- Only install relevant D3 modules: I'm not familiar enough with D3 to know what I'd need other than D3 Geo at the moment
- Use topojson for initial setup files to reduce the load
- Use the listed stops from schedule requests in routes view as the actual returned stops are useless. Possibly genereate those stops into default json instead? This would improve the data displayed at several points
- Redo the API builders to store data better (there are big issues with how I took down stops, best approach would be to pull the more generic ones from the pretty horrible schedule values they return)
- Loading operations, very primitive one at the moment which do not run great
- Gather data from schedules so some routes wouldn't display during their off hours if desired
- Horrible naming (paths could referring to URL paths or SVG paths, routes could be react router or transit routes...)

UI
- Responsive design
- Pan and Zoom (again)
- Labeling; following the inclusion of pan and zoom I'd go to town on labelling, it'd just cause a mess right now but would be necessary for mobile at least, popovers would be a possible compromise
- Include direction of vehicles in live feed
- I'd consider flagging connections on routes but I know Muni's rail system is a bit different to the bus in this regard and I see no means of handling that
- Only display active routes (currently have manually moved all "Owl" routes to start so they're not covering the more active rail routes covering the same area)
- Subtly display stop points along route
- Note direction on route (inbound, outbound, both)
- Really needs to figure out something to do with the busy-ness of Market Street routes


# NextBus API Toolset

## Motive

I noticed that the API didn't provide any means to gather stops and that individual route requests were pretty large to the point a user could potentially hit the request limit. As I didn't want to throttle the API with request, I built some scripts to gather data and condense it so the app will load with all the (relatively) static data.

## Available Scripts

`npm run nextbus_api_reqs` will fetch all SF Muni routes and store them in individual JSON files, this includes all stop information and a thorough collection of coordinates for their path

`npm run nextbus_aggregated` will aggregate all of the stops from the list of routes, removing repeat entries, these are stored within a json file with their relative tags as the keys. Following that, the routes are collected together into a much smaller file by gathering everything from the individual route, removing the paths and all stop data other than than ID

`npm run nextbus_geojsons` will build geojson files for all route paths and all stops, this requires both of the aforementioned scripts data to have been generated

`npm run nextbus_setup` runs all of the above in order, I'd recommend against using it at the moment as the api reqs aren't 100% stable

All of these can be reused for any other region and I'll probably move them into a script of their own and tidy it all up

## Issues and Notes

The API requests script currently uses the [npm sleep package](https://www.npmjs.com/package/sleep) between each request to stop the API from hitting the 20 second limit. I gather this package has issues on some machines so I might replace it with something else.

The data returned for stops is excessively detailed (e.g. inbound and outbound stops on the same block are registered as different) so there'd really need to be some process to gather similar stops 

The actual location data often seems incredibly off, maybe buses out of duty or buses on the wrong route
