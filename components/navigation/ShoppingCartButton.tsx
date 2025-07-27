import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed'; 

type ShoppingCartButtonProps = {
  
  destination: string; 
};

export default function ShoppingCartButton({ destination }: ShoppingCartButtonProps) {
  const iconColor = useThemeColor({}, 'text'); 

  return (
    <View style={styles.container}>
    
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="shopping-cart"
              size={25}
              color={iconColor}
              style={{ opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 15, 
  },
});