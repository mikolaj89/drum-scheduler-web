import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    surface: '#FFFFFF',
    border: '#D6D9DE',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    secondarySurface: '#EEF2F7',
    secondaryBorder: '#E3E8F0',
    secondaryText: '#3B82F6',
    shadow: 'rgba(0,0,0,0.12)',
  },
};

export const styles = StyleSheet.create({
  controlsWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  controlBtnSecondary: {
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 2,
    backgroundColor: theme.colors.secondarySurface,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBorder,
  },
  controlBtnSecondaryText: {
    color: theme.colors.secondaryText,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  controlBtnSecondaryIconLeft: {
    marginLeft: -8,
  },
  controlBtnSecondaryIconRight: {
    marginRight: -8,
  },
  controlBtnDisabled: {
    opacity: 0.45,
  },
});
