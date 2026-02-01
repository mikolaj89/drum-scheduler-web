import React, { useState } from 'react';
import { View, FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionsQuery } from '@drum-scheduler/sdk';
import { Session } from '@drum-scheduler/contracts';
import { API_BASE_URL } from '../../../config/api';
import { SessionsHeader } from './sessions-header';
import { SessionLoadingPlaceholder } from '../session-list/session-loading-placeholder/session-loading-placeholder';
import { SessionListItem } from '../session-list/session-list-item/session-list-item';
import { styles } from './sessions-screen.style';

export default function SessionsScreen({
  onOpenSession,
}: {
  onOpenSession?: (sessionId: number) => void;
}) {
  const [query, setQuery] = useState('');

  const sessionsResult = useSessionsQuery(API_BASE_URL);

  const renderItem = ({ item }: ListRenderItemInfo<Session>) => (
    <SessionListItem session={item} onPress={() => onOpenSession?.(item.id)} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <SessionsHeader query={query} onChangeQuery={setQuery} />

        <SessionLoadingPlaceholder
          isLoading={Boolean(sessionsResult?.isLoading)}
        />

        <FlatList
          data={sessionsResult?.data ?? []}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
