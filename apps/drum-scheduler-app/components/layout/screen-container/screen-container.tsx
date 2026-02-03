import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './screen-container.style';
import { MD3LightTheme as PaperTheme, PaperProvider, useTheme } from 'react-native-paper';

const paperTheme = {
  ...PaperTheme,
  roundness: 3,
  //setup if needed
  // colors: {
  //   ...PaperTheme.colors,
  //   background: appTheme.colors.bg,
  //   surface: appTheme.colors.surface,
  //   primary: appTheme.colors.primary,
  //   outline: appTheme.colors.border,
  //   onSurface: appTheme.colors.text,
  //   onSurfaceVariant: appTheme.colors.textMuted,
  // },
};

export const ScreenContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView style={styles.safe}>
        <View
          style={[styles.screen, { backgroundColor: theme.colors.background }]}
        >
          {children}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
