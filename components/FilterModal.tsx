import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView, 
} from 'react-native';
import { useThemeColor } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useProducts } from '@/context/ProductContext';

export default function FilterModal() {
  const {
    isFilterModalVisible,
    setIsFilterModalVisible,
    selectedCategories,
    minPrice,
    maxPrice,
    handleApplyFilter,
    availableCategories,
  } = useProducts();

  const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>(selectedCategories);
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice);

  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const borderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholderText');

  useEffect(() => {
    if (isFilterModalVisible) {
      setLocalSelectedCategories(selectedCategories);
      setLocalMinPrice(minPrice);
      setLocalMaxPrice(maxPrice);
    }
  }, [isFilterModalVisible, selectedCategories, minPrice, maxPrice]);

  const [localNumActiveFilters, setLocalNumActiveFilters] = useState(0);
  useEffect(() => {
    let count = 0;
    count += localSelectedCategories.length;
    if (localMinPrice !== '' && parseFloat(localMinPrice) >= 0) {
      count++;
    }
    if (localMaxPrice !== '' && parseFloat(localMaxPrice) >= 0) {
      count++;
    }
    setLocalNumActiveFilters(count);
  }, [localSelectedCategories, localMinPrice, localMaxPrice]);

  const handleApply = () => {
    handleApplyFilter(localSelectedCategories, localMinPrice, localMaxPrice);
  };

  const handleClear = () => {
    setLocalSelectedCategories([]);
    setLocalMinPrice('');
    setLocalMaxPrice('');
  };

  const renderOption = (value: string | null) => {
    if (value === null || value === undefined) {
      return null;
    }
    const displayValue = String(value);
    const isSelected = localSelectedCategories.includes(value);

    const toggleCategory = () => {
      if (value === 'All') {
        setLocalSelectedCategories([]);
      } else {
        const newSelection = isSelected
          ? localSelectedCategories.filter((cat) => cat !== value)
          : [...localSelectedCategories, value];
        setLocalSelectedCategories(newSelection);
      }
    };

    return (
      <TouchableOpacity
        key={displayValue}
        style={[
          styles.optionButton,
          { borderColor: borderColor },
          isSelected && { backgroundColor: tintColor },
        ]}
        onPress={toggleCategory}
      >
        <Text style={[styles.optionText, { color: isSelected ? buttonTextColor : textColor }]}>
          {displayValue}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setIsFilterModalVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <Pressable style={styles.centeredView} onPress={() => setIsFilterModalVisible(false)}>
          <Pressable style={[styles.modalView, { backgroundColor: cardBackgroundColor }]} onPress={(e) => e.stopPropagation()}>
    
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <FontAwesome name="times" size={20} color={textColor} />
              </TouchableOpacity>
            </View>

         
            <ScrollView
              style={styles.scrollViewContent} 
              contentContainerStyle={styles.scrollViewInnerContent} 
              keyboardShouldPersistTaps="handled" 
            >
         
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Categories</Text>
                <View style={styles.optionsContainer}>
                  {renderOption('All')}
                  {availableCategories
                    .filter(cat => typeof cat === 'string' && cat !== null && cat !== undefined)
                    .map((cat) => renderOption(cat))}
                </View>
              </View>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Price Range</Text>
                <View style={styles.priceInputsContainer}>
                  <TextInput
                    style={[styles.priceInput, { borderColor: borderColor, color: textColor }]}
                    placeholder="Min"
                    placeholderTextColor={placeholderTextColor}
                    keyboardType="numeric"
                    value={localMinPrice}
                    onChangeText={setLocalMinPrice}
                  />
                  <Text style={[styles.priceSeparator, { color: textColor }]}>-</Text>
                  <TextInput
                    style={[styles.priceInput, { borderColor: borderColor, color: textColor }]}
                    placeholder="Max"
                    placeholderTextColor={placeholderTextColor}
                    keyboardType="numeric"
                    value={localMaxPrice}
                    onChangeText={setLocalMaxPrice}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.actionButton, styles.clearButton, { borderColor: borderColor }]} onPress={handleClear}>
                <Text style={[styles.actionButtonText, { color: tintColor }]}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.applyButton, { backgroundColor: tintColor }]} onPress={handleApply}>
                <Text style={[styles.actionButtonText, { color: buttonTextColor }]}>
                  Apply Filters
                </Text>
                {localNumActiveFilters > 0 && (
                  <View style={[styles.badge, { backgroundColor: buttonTextColor }]}>
                    <Text style={[styles.badgeText, { color: tintColor }]}>
                      {localNumActiveFilters}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
   
    flexDirection: 'column',
    justifyContent: 'space-between', 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%', 
  },
  scrollViewInnerContent: {
    paddingBottom: 20, 
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    height: 40,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
   
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  clearButton: {
    borderWidth: 1,
  },
  applyButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});