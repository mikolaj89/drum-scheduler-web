import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('react-native-audio-api', () => {
	class MockAudioContext {
		constructor() {
			this.currentTime = 0;
			this.destination = {};
		}
		createBufferSource() {
			return {
				connect: jest.fn(),
				start: jest.fn(),
				stop: jest.fn(),
				buffer: null,
			};
		}
		createGain() {
			return {
				connect: jest.fn(),
				gain: {
					setValueAtTime: jest.fn(),
					exponentialRampToValueAtTime: jest.fn(),
				},
			};
		}
		decodeAudioData() {
			return Promise.resolve({});
		}
	}

	return {
		AudioContext: MockAudioContext,
		AudioBuffer: class MockAudioBuffer {},
	};
});

jest.mock('react-native-fs', () => ({
	readFileAssets: jest.fn().mockResolvedValue(''),
}));
