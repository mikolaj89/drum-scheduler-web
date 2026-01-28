import { renderHook, act } from '@testing-library/react-native';
import { useExercise } from './use-exercise';
import { useTimer } from './use-time-countdown';

jest.mock('./use-time-countdown', () => ({
  useTimer: jest.fn(),
}));

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>;

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
    const { result } = renderHook(() => useExercise({ duration: 5 }));

    expect(result.current.mode).toBe('preview');
    expect(result.current.timeFormatted).toBe('05:00');
  });

  it('switches to active on start', () => {
    const { result } = renderHook(() => useExercise({ duration: 5 }));

    act(() => {
      result.current.startExercise();
    });

    expect(result.current.mode).toBe('active');
  });

  it('switches to paused on pause', () => {
    const { result } = renderHook(() => useExercise({ duration: 5 }));

    act(() => {
      result.current.pauseExercise();
    });

    expect(result.current.mode).toBe('paused');
  });

  it('returns to preview on finish', () => {
    const { result } = renderHook(() => useExercise({ duration: 5 }));

    act(() => {
      result.current.startExercise();
      result.current.finishExercise();
    });

    expect(result.current.mode).toBe('preview');
  });
});
