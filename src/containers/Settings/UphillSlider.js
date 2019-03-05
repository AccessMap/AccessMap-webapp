import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as AppActions from "actions";

import Slider from "react-md/src/js/Sliders";

import { defaultProfiles } from "profiles";

const UphillSlider = props => {
  const { actions, disabled, inclineMax } = props;

  const uphillPercent = +(inclineMax * 100).toFixed(1);

  return (
    <Slider
      disabled={disabled}
      discrete
      id="uphill-slider"
      label={`Maximum uphill steepness: ${uphillPercent}%`}
      defaultValue={uphillPercent}
      min={4}
      max={15}
      step={0.5}
      valuePrecision={1}
      onChange={d => actions.setInclineMax(d / 100)}
      value={uphillPercent}
    />
  );
};

UphillSlider.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  disabled: PropTypes.bool,
  inclineMax: PropTypes.number.isRequired
};

const mapStateToProps = state => {
  const { profile } = state;
  const { selected } = profile;

  const selectedProfile =
    selected === "Custom" ? profile.custom : defaultProfiles[selected];

  return {
    disabled: selected !== "Custom",
    inclineMax: selectedProfile.inclineMax
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(AppActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UphillSlider);
