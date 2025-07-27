import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';

type MenuButtonProps = {
  onPress?: () => void; 
  destination?: string; 
};

export default function MenuButton({ onPress, destination }: MenuButtonProps) {
  const iconColor = useThemeColor({}, 'text');

  const ButtonContent = ({ pressed }: { pressed: boolean }) => (
    <FontAwesome
      name="bars"
      size={25}
      color={iconColor}
      style={{ opacity: pressed ? 0.5 : 1 }}
    />
  );

  return (
    <View style={styles.container}>
      {destination ? (
        
          <Pressable>{({ pressed }) => <ButtonContent pressed={pressed} />}</Pressable>
      
      ) : (
        <Pressable onPress={onPress}>
          {({ pressed }) => <ButtonContent pressed={pressed} />}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 15, 
  },
});