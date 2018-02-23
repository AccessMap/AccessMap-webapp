import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactMapboxGl from 'react-mapbox-gl';

import * as AppActions from 'actions';

import PedestrianSource from './source-pedestrian';

import Crossings from './layers-crossings';
import Geolocation from './layers-geolocation';
import Route from './layers-route';
import Sidewalks from './layers-sidewalks';
import Waypoints from './layers-waypoints';


const CLICKABLE_LAYERS = [
  'sidewalk',
  'crossing',
  'sidewalk-inaccessible',
  'crossing-inaccessible'
];

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_TOKEN,
  bearing: [0],
  pitch: [0]
});

class AccessMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: [15],
      width: 0,
      height: 0,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    const width = this.mapEl.container.clientWidth;
    const height = this.mapEl.container.clientHeight;
    if (this.state.width != width | this.state.height != height) {
      this.setState({
        width,
        height,
      });
      this.props.actions.resizeMap(width, height);
    }
  }

  render() {
    const {
      actions,
      center,
      zoom,
      ...props
    } = this.props;

    // NOTE: Do not create actions that modify the `view` substate via
    // onMoveEnd or onZoomEnd. If you do, it creates an infinite loop.
    return (
      <Map
        ref={(el) => { this.mapEl = el; }}
        center={center}
        zoom={[zoom]}
        bearing={[0]}
        pitch={[0]}
        /* eslint-disable react/style-prop-object */
        style='mapbox://styles/accessmap/cjdl9ee8d03es2rqod4413t1w'
        /* eslint-enable react/style-prop-object */
        onMoveEnd={(m, e) => {
          const newBounds = m.getBounds().toArray();
          const bbox = [
            newBounds[0][0],
            newBounds[0][1],
            newBounds[1][0],
            newBounds[1][1]
          ];

          if (e.originalEvent) {
            const { lng, lat } = m.getCenter();
            actions.mapMove([lng, lat], m.getZoom(), bbox);
          } else {
            actions.logBounds(bbox);
          }
        }}
        onMouseDown={(m, e) => {
          // NOTE: We can't use the 'contextmenu' event, because of
          // inconsistent behavior between devices and browsers. Specifically,
          // iOS safari doesn't create 'contextmenu' events, so to prevent
          // double-firing on all other browsers, we just check for 'right
          // click' on desktop and manually manage a long press using touch
          // events.
          if (e.originalEvent.button === 2) {
            // Right click!
            const { lng, lat } = e.lngLat;
            actions.mapContextClick(lng, lat);
          }
        }}
        onContextMenu={(m, e) => {
          // Ignore the context menu event
        }}
        onTouchStart={(m, e) => {
          const { lng, lat } = e.lngLat;
          clearTimeout(this.longPressTrigger);
          this.longPressTrigger = setTimeout(() => {
            actions.mapContextClick(lng, lat);
          }, 500);
        }}
        onTouchMove={() => clearTimeout(this.longPressTrigger)}
        onTouchEnd={(m, e) => {
          clearTimeout(this.longPressTrigger);
        }}
        onMouseMove={(m, e) => {
          const layers = CLICKABLE_LAYERS.filter(l => m.getLayer(l));
          const features = m.queryRenderedFeatures(e.point, {
            layers: layers,
          });
          m.getCanvas().style.cursor = features.length ? 'pointer': 'default';
        }}
        onDrag={(m, e) => {
          m.getCanvas().style.cursor = 'grabbing';
        }}
        onClick={(m, e) => {
          const layers = CLICKABLE_LAYERS.filter(l => m.getLayer(l));
          const features = m.queryRenderedFeatures(e.point, {
            layers: CLICKABLE_LAYERS
          });
          actions.mapClick(features);
        }}
        onStyleLoad={(m) => {
          // TODO: run this earlier - right after mapbox style load
          const newBounds = m.getBounds().toArray();
          const bbox = [
            newBounds[0][0],
            newBounds[0][1],
            newBounds[1][0],
            newBounds[1][1]
          ];
          actions.logBounds(bbox);
        }}

        {...props}
      >

        <PedestrianSource />

        <Crossings />
        <Route before='crossing-outline' />
        <Sidewalks />
        <Waypoints />
        <Geolocation />
      </Map>
    );
  }
}

AccessMap.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  /* eslint-disable react/require-default-props */
  actions: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  /* eslint-enable react/require-default-props */
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

AccessMap.defaultProps = {
  center: [-122.333592, 47.605628],
  zoom: 15,
};

function mapStateToProps(state) {
  const {
    view,
  } = state;

  return {
    center: [view.lng, view.lat],
    zoom: view.zoom,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AppActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccessMap);
