import { StyleSheet } from 'react-native';
import { theme } from '../../utils/theme';

export const styles = StyleSheet.create({
  tabsOuter: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    padding: 4,
    backgroundColor: theme.colors.pillBg,
    borderRadius: 999,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabBtn: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.pillText,
  },
  tabTextActive: {
    color: theme.colors.primaryText,
  },
});
