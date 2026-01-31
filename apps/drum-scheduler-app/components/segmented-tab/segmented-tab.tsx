import { Pressable, Text, View } from 'react-native';
import { styles } from './segmented-tab.style';

export const SegmentedTabs = ({
  tabs,
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
  tabs: string[];
}) => {
  return (
    <View style={styles.tabsOuter}>
      {tabs.map(t => {
        const active = t === value;
        return (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            style={[styles.tabBtn, active && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {t}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
