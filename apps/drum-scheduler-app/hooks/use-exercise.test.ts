import { renderHook, act } from '@testing-library/react-native';
import { useExercise } from './use-exercise';
import { useTimer } from './use-time-countdown';
import { Exercise } from '@drum-scheduler/contracts';

jest.mock('./use-time-countdown', () => ({
  useTimer: jest.fn(),
}));

const exercisesFixture: Exercise[] = [
  {
    id: 1,
    name: 'Test Exercise',
    categoryId: null,
    description: 'Test Description',
    durationMinutes: 5,
    bpm: 100,
    mp3Url: null,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Second Exercise',
    categoryId: null,
    description: null,
    durationMinutes: null,
    bpm: null,
    mp3Url: null,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>;
const mockUseNavigation = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual<object>('@react-navigation/native'),
  useNavigation: () => mockUseNavigation(),
}));

describe('useExercise', () => {
  beforeEach(() => {
    mockUseTimer.mockReturnValue({
      secondsLeft: 300,
      startCountdown: jest.fn(),
      stopCountdown: jest.fn(),
      resetCountdown: jest.fn(),
    });
  });

  it('starts in preview mode and formats time', () => {
    const { result } = renderHook(() =>
      useExercise({ exercises: exercisesFixture, exerciseIndex: 1 }),
    );

    expect(result.current.mode).toBe('preview');
    expect(result.current.timeFormatted).toBe('05:00');
  });

  it('switches to active on start', () => {
    const { result } = renderHook(() =>
      useExercise({ exercises: exercisesFixture, exerciseIndex: 1 }),
    );

    act(() => {
      result.current.startExercise();
    });

    expect(result.current.mode).toBe('active');
  });

  it('switches to paused on pause', () => {
    const { result } = renderHook(() =>
      useExercise({ exercises: exercisesFixture, exerciseIndex: 1 }),
    );

    act(() => {
      result.current.startExercise();
    });

    act(() => {
      result.current.pauseExercise();
    });
    expect(result.current.mode).toBe('paused');
  });

  it('returns to preview on finish', () => {
    const { result } = renderHook(() =>
      useExercise({ exercises: exercisesFixture, exerciseIndex: 1 }),
    );

    act(() => {
      result.current.startExercise();
      result.current.finishExercise();
    });

    expect(result.current.mode).toBe('preview');
  });

  it('get correct current exercise and index', () => {
    const { result } = renderHook(() =>
      useExercise({ exercises: exercisesFixture, exerciseIndex: 2 }),
    );

    expect(result.current.currentExercise.id).toBe(2);
    expect(result.current.currentExercise.description).toBe('—');
    expect(result.current.currentExercise.name).toBe('Second Exercise');
    expect(result.current.currentExercise.durationMinutes).toBe(0);
    expect(result.current.currentExercise.bpm).toBe(0);
    expect(result.current.currentIndex).toBe(2);
  });

  it('get correct disable states for controls', () => {
    const { result } = renderHook(() =>
      useExercise({ exercises: exercisesFixture, exerciseIndex: 1 }),
    );

    expect(result.current.isPlayDisabled).toBe(false);
    expect(result.current.isPauseDisabled).toBe(true);
    expect(result.current.isPrevDisabled).toBe(true);
    expect(result.current.isNextDisabled).toBe(false);

    act(() => {
      result.current.startExercise();
    });

    expect(result.current.isPlayDisabled).toBe(true);
    expect(result.current.isPauseDisabled).toBe(false);
    expect(result.current.isPrevDisabled).toBe(true);
    expect(result.current.isNextDisabled).toBe(true);
  });
});
