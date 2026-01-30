import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ExerciseScreen from './exercise-screen';
import type { Exercise } from '@drum-scheduler/contracts';
import { NavigationContainer } from '@react-navigation/native';

const exerciseFixture: Exercise = {
  id: 2,
  name: 'Paradiddle',
  categoryId: null,
  description: 'RLRR LRLL',
  durationMinutes: 5,
  bpm: 120,
  mp3Url: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const exercisesFixture: Exercise[] = Array.from({ length: 10 }, (_, i) => {
  const id = i + 1;
  if (id === 2) return exerciseFixture;
  return {
    ...exerciseFixture,
    id,
    name: `Exercise ${id}`,
    description: `Desc ${id}`,
  };
});

describe('ExerciseScreen', () => {
  it('renders exercise details and progress', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ExerciseScreen
          exercises={exercisesFixture}
          sessionName="Session 2026"
          exerciseIndex={2}
          onBack={() => {}}
        />
      </NavigationContainer>,
    );

    expect(getByText('Session 2026')).toBeTruthy();
    expect(getByText('Paradiddle')).toBeTruthy();
    expect(getByText('RLRR LRLL')).toBeTruthy();
    expect(getByText('5 min')).toBeTruthy();
    expect(getByText('120')).toBeTruthy();
    expect(getByText('Exercise 2 / 10')).toBeTruthy();
  });

  it('shows timer after pressing play', () => {
    const { getByLabelText, getByText } = render(
      <NavigationContainer>
      <ExerciseScreen
        exercises={exercisesFixture}
        sessionName="Session 2026"
        exerciseIndex={2}
        onBack={() => {}}
      />
      </NavigationContainer>,
    );

    fireEvent.press(getByLabelText('Play'));

    expect(getByText('BPM 120')).toBeTruthy();
    expect(getByText(/0[4-5]:\d{2}/)).toBeTruthy(); // regex check for proper timer format, (eg. 04:59), so it will work even when values change due to countdown
  });

  it('prevent from going to previous exercise if on first exercise', () => {
    const { getByLabelText } = render(
      <NavigationContainer>
      <ExerciseScreen
        exercises={exercisesFixture}
        sessionName="Session 2026"
        exerciseIndex={1}
        onBack={() => {}}
      />
      </NavigationContainer>,
    );

    const prevButton = getByLabelText('Previous');
    expect(prevButton.props.accessibilityState.disabled).toBe(true);
  });

  it('allow going to next exercise', () => {
    const { getByLabelText } = render(
      <NavigationContainer>
      <ExerciseScreen
        exercises={exercisesFixture}
        sessionName="Session 2026"
        exerciseIndex={1}
        onBack={() => {}}
      />
      </NavigationContainer>,
    );

    const nextButton = getByLabelText('Next');
    expect(nextButton.props.accessibilityState.disabled).toBe(false);
  });
});
