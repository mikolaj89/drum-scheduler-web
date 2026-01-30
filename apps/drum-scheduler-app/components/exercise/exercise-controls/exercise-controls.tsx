import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles, theme } from './exercise-controls.style';

export default function ExerciseControls({
  isPrevDisabled,
  isNextDisabled,
  isPlayDisabled,
  isPauseDisabled,
  onPrev,
  onPlay,
  onPause,
  onFinish,
  onNext,
}: {
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isPlayDisabled: boolean;
  isPauseDisabled: boolean;
  onPrev: () => void;
  onPlay: () => void;
  onPause: () => void;
  onFinish: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.controlsWrap}>
      <View style={styles.controlsBar}>
        <Pressable
          style={[
            styles.controlBtnSecondary,
            isPrevDisabled && styles.controlBtnDisabled,
          ]}
          onPress={onPrev}
          accessibilityLabel="Previous"
          disabled={isPrevDisabled}
        >
          <Icon name="chevron-left" size={22} color={theme.colors.secondaryText} style={styles.controlBtnSecondaryIconLeft} />
          <Text style={styles.controlBtnSecondaryText}>PREV</Text>
        </Pressable>

        <Pressable
          style={[
            styles.controlBtn,
            isPlayDisabled && styles.controlBtnDisabled,
          ]}
          onPress={onPlay}
          accessibilityLabel="Play"
          disabled={isPlayDisabled}
        >
          <Icon name="play-arrow" size={26} color={theme.colors.primaryText} />
        </Pressable>

        <Pressable
          style={[
            styles.controlBtn,
            isPauseDisabled && styles.controlBtnDisabled,
          ]}
          onPress={onPause}
          accessibilityLabel="Pause"
          disabled={isPauseDisabled}
        >
          <Icon name="pause" size={26} color={theme.colors.primaryText} />
        </Pressable>

        <Pressable
          style={styles.controlBtn}
          onPress={onFinish}
          accessibilityLabel="Finish"
        >
          <Icon name="stop" size={26} color={theme.colors.primaryText} />
        </Pressable>

        <Pressable
          style={[
            styles.controlBtnSecondary,
            isNextDisabled && styles.controlBtnDisabled,
          ]}
          onPress={onNext}
          accessibilityLabel="Next"
          disabled={isNextDisabled}
        >
          <Text  style={styles.controlBtnSecondaryText}>NEXT</Text>
          <Icon name="chevron-right" size={22} color={theme.colors.secondaryText} style={styles.controlBtnSecondaryIconRight} />
        </Pressable>
      </View>
    </View>
  );
}
