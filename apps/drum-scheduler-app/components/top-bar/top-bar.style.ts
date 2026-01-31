import { StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

export const styles = StyleSheet.create({
  topBar: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // gap: theme.spacing.sm,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  iconBtn: {
    width: 32,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -8 }],
  },
  menuButton: {},
});
