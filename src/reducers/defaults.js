import { customProfile as customProfileDefault } from "profiles";
import cloneObject from "utils/clone-object";
import { mainTours } from "constants/tours";

export const defaultActivities = {
  drawerVisible: false,
  settingProfile: false,
  viewingDirections: false,
  viewingMapInfo: false,
  viewingRoute: false,
  viewingRouteInfo: false
};

export const defaultAnalytics = null;

export const defaultAuth = null;

export const defaultBrowser = {
  displayMode: "landscape",
  mediaType: null,
  mapWidth: null,
  mapHeight: null
};

export const defaultGeolocation = null;

export const defaultLinkOverlay = null;

export const defaultLog = {
  bounds: null
};

export const defaultMap = {
  inclineUphill: true,
  selectedFeature: null
};

export const defaultProfile = {
  filter: ["Wheelchair", "Powered", "Cane", "Custom"],
  custom: cloneObject(customProfileDefault),
  selected: "Wheelchair",
  editorMode: "UPHILL"
};

export const defaultToasts = [];

export const defaultRoute = {
  fetchingRoute: false,
  routeResult: null
};

export const defaultRouteSettings = {
  dateTime: new Date().getTime()
};

export const defaultTour = {
  tours: mainTours,
  enabled: false
};

export const defaultView = {
  mapWidth: null,
  mapHeight: null
};

export const defaultWaypoints = {
  destination: null,
  origin: null,
  poi: null
};
