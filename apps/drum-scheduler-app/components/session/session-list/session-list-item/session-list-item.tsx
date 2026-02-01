import React from 'react';
import { View } from 'react-native';
import {
  Avatar,
  IconButton,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import type { Session } from '@drum-scheduler/contracts';
import {
  getFormattedMinutes,
  getLastFinishedDateFormatted,
} from '../../session-utils';
import { styles } from './session-list-item.style';

export function SessionListItem({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  return (
    <Surface style={styles.card} elevation={1}>
      <TouchableRipple onPress={onPress}>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Avatar.Icon size={36} icon="account-music-outline" style={styles.cardAvatar} />
            <View style={styles.cardTextWrap}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {session.name}
              </Text>
              <Text variant="bodySmall" style={styles.cardMeta}>
                Total duration: {getFormattedMinutes(session.totalDuration ?? 0)} •{' '}
                {session.lastFinishDate
                  ? getLastFinishedDateFormatted(session.lastFinishDate)
                  : 'never'}
              </Text>
            </View>
            <IconButton icon="chevron-right" size={20} style={styles.cardChevron} />
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
}
