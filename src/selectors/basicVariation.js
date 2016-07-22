import { createSelector } from 'reselect';

import { MODE_FIRST_PART, MODE_SECOND_PART, MODE_TO_PART_MAPPING, MODE_PATTERN_CLEAR } from 'constants';
import { trackLengthKey } from 'helpers';
import { getSelectedMode, getPlaying, getCurrentStep, getSelectedRhythm } from 'selectors/common';

const getBasicVariationPosition = (state) => state.basicVariationPosition;
const getPartLengths = (state) => state.rhythmLengths;
const getClearPressed = (state) => state.clearPressed;

// return the current basic variation value (0=A, 1=AB, 2=B)
export default createSelector(
  [
    getPlaying, getSelectedMode, getCurrentStep, getSelectedRhythm,
    getPartLengths, getBasicVariationPosition, getClearPressed
  ],
  (playing, selectedMode, currentStep, selectedRhythm, rhythmLengths, basicVariationPosition, clearPressed) => {
    if (playing) {
      if (basicVariationPosition === 1) {
        switch(selectedMode) {
          case MODE_FIRST_PART:
          case MODE_SECOND_PART:
            const currentPart = MODE_TO_PART_MAPPING[selectedMode];
            const partLength = rhythmLengths[trackLengthKey(selectedRhythm, currentPart)];
            return (Math.floor(currentStep / partLength) % 2) * 2;
          default:
            return basicVariationPosition;
        }
      } else {
        return basicVariationPosition;
      }
    } else {
      if (selectedMode === MODE_PATTERN_CLEAR && !clearPressed) {
        return -1; // no variation lights active
      } else {
        return basicVariationPosition;
      }
    }
  }
)