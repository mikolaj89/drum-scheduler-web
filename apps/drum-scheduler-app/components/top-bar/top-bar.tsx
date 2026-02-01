import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { styles } from './top-bar.style';

export function TopBar({
  title,
  onBack,
  onMenu,
  children,
}: {
  title?: string;
  onBack?: () => void;
  onMenu?: () => void;
  children?: ReactNode;
}) {
  const showTitle = Boolean(title) && !children;
  const showMenu = !onBack && Boolean(onMenu);
  return (
    <Appbar.Header mode="small" elevated statusBarHeight={0} style={styles.appbar}>
      {onBack ? (
        <Appbar.Action icon="arrow-left" onPress={onBack} />
      ) : showMenu ? (
        <Appbar.Action icon="menu" onPress={onMenu} />
      ) : null}

      {showTitle ? (
        <Appbar.Content title={title} />
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </Appbar.Header>
  );
}
