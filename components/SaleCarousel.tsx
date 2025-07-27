

import React, { useRef, useState, useEffect } from 'react'; 
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { useThemeColor } from '@/components/Themed';
import salesImage1 from '@/assets/sales/1.png';
import salesImage2 from '@/assets/sales/2.png';
import salesImage3 from '@/assets/sales/3.png';
import salesImage4 from '@/assets/sales/4.png';
import salesImage5 from '@/assets/sales/5.png'; 


const { width: screenWidth } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  image: ImageSourcePropType;
  title?: string;
  link?: string;
}

const DUMMY_SALE_IMAGES: CarouselItem[] = [
  { id: '1', image: salesImage1, title: 'Flash Sale 1', link: '/sale/flash1' },
  { id: '2', image: salesImage2, title: 'New Collection', link: '/collection/new' },
  { id: '3', image: salesImage3, title: 'Summer Deals', link: '/sale/summer' },
  { id: '4', image: salesImage4, title: 'Limited Time', link: '/offers/limited' },
  { id: '5', image: salesImage5, title: 'Backpack Sale', link: '/sale/backpack' },
];

interface SaleCarouselProps {
  carouselItems?: CarouselItem[];
  itemWidth?: number;
  itemHeight?: number;
  onItemPress?: (item: CarouselItem) => void;
  autoScrollInterval?: number;
}

const SaleCarousel: React.FC<SaleCarouselProps> = ({
  carouselItems = DUMMY_SALE_IMAGES,
  itemWidth = screenWidth * 0.9,
  itemHeight = itemWidth * 0.65,
  onItemPress,
  autoScrollInterval = 3000, 
}) => {
  const flatListRef = useRef<FlatList<CarouselItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const dotColor = useThemeColor({}, 'tint');
  const inactiveDotColor = useThemeColor({}, 'tabBorder');

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveIndex(index);
  };


  useEffect(() => {
    if (carouselItems.length <= 1) return; 

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselItems.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [carouselItems.length, autoScrollInterval]); 

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <TouchableOpacity
      style={[styles.carouselItemContainer, { width: itemWidth, height: itemHeight }]}
      onPress={() => onItemPress && onItemPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={item.image}
        style={styles.carouselImage}
        resizeMode="stretch" 
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />
     
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.paginationDotsContainer}>
        {carouselItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? dotColor : inactiveDotColor },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  flatListContent: {
    paddingHorizontal: screenWidth * 0.05,
  },
  carouselItemContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: screenWidth * 0.025,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default SaleCarousel;