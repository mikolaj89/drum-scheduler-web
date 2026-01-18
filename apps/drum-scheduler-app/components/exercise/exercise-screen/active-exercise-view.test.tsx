import React from 'react';
import { render } from '@testing-library/react-native';
import ActiveExerciseView from './active-exercise-view';

describe('ActiveExerciseView', () => {
  it('renders name, bpm and time', () => {
    const { getByText } = render(
      <ActiveExerciseView name="Trójki" bpm={170} timeFormatted="02:59" />
    );

    expect(getByText('Trójki')).toBeTruthy();
    expect(getByText('BPM 170')).toBeTruthy();
    expect(getByText('02:59')).toBeTruthy();
  });
});
