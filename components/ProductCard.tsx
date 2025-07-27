import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [isFavorite, setIsFavorite] = useState(false);

  const apiRating = product.rating.rate;
  const apiNumReviews = product.rating.count;

  const handlePress = () => {
    console.log(`Product details: ${JSON.stringify(product)}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(`Product ${product.title} favorite status: ${!isFavorite}`);
  };

  const renderStars = (starRating: number, numReviews: number) => {
    const stars = [];
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={`full-${i}`} name="star" size={14} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesome key="half" name="star-half-o" size={14} color="#FFD700" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesome key={`empty-${i}`} name="star-o" size={14} color="#FFD700" />);
    }

    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={[styles.ratingText, { color: themeColors.text }]}>
          ({apiRating.toFixed(1)})
        </Text>
        <Text style={[styles.reviewCountText, { color: themeColors.text }]}>
          ({apiNumReviews})
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={22}
            color={isFavorite ? themeColors.tint : '#4169E1'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.productTitle, { color: themeColors.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.productPrice, { color: themeColors.tint }]}>
          ${product.price.toFixed(2)}
        </Text>
        {renderStars(apiRating, apiNumReviews)}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    marginTop: 10,
    position: 'relative',
  },
  productImage: {
    width: '90%',
    height: '100%',
    alignSelf: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 20,
    padding: 5,
   boxShadow: '0 2px 4px rgba(10, 42, 158, 0.07)',
    backgroundColor: 'rgba(255, 255, 255, 0.47)', 
  },
  infoContainer: {
    padding: 10,
    width: '100%',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    height: 40,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 13,
    marginLeft: 5,
    fontWeight: '500',
  },
  reviewCountText: {
    fontSize: 13,
    marginLeft: 5,
  },
});