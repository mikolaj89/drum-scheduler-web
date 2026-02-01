import React from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { TopBar } from '../../top-bar/top-bar';
import { styles } from './sessions-header.style';

export function SessionsHeader({
  query,
  onChangeQuery,
}: {
  query: string;
  onChangeQuery: (value: string) => void;
}) {
  return (
    <>
      <TopBar title="Sessions" onMenu={() => {}} />

      <View style={styles.searchWrap}>
        <Searchbar
          placeholder="Search sessions..."
          value={query}
          onChangeText={onChangeQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>
    </>
  );
}
