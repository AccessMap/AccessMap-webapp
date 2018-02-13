import { combineReducers } from 'redux';

import activities from './activities';
import browser from './browser';
import geolocation from './geolocation';
import log from './log';
import map from './map';
import mode from './mode';
import routingprofile from './routing-profile';
import tripplanning from './tripplanning';
import view from './view';
import waypoints from './waypoints';

import { routerReducer } from 'react-router-redux';
import { reducer as oidcReducer } from 'redux-oidc';

/**
 * Routing to be implemented
 */
export default combineReducers({
  activities,
  browser,
  geolocation,
  log,
  map,
  mode,
  routingprofile,
  tripplanning,
  view,
  waypoints,
  routing: routerReducer,
  oidc: oidcReducer,
});
