

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useThemeColor } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useProducts } from '@/context/ProductContext'; 

type SortOrder = 'asc' | 'desc' | 'newest' | 'popularity' | null;



export default function SortModal() { 

  const {
    isSortModalVisible,
    setIsSortModalVisible,
    sortOrder,
    handleApplySort,
  } = useProducts();

  
  const [localSortOrder, setLocalSortOrder] = useState<SortOrder>(sortOrder);


  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const borderColor = useThemeColor({}, 'border');


  useEffect(() => {
    if (isSortModalVisible) {
      setLocalSortOrder(sortOrder);
    }
  }, [isSortModalVisible, sortOrder]);


  const handleApply = () => {
    // Call the context's apply function
    handleApplySort(localSortOrder);
  };

  const handleClear = () => {
    setLocalSortOrder(null);
  };

  const renderSortOption = (label: string, value: SortOrder) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.sortOptionButton,
        { borderColor: borderColor },
        localSortOrder === value && { backgroundColor: tintColor },
      ]}
      onPress={() => setLocalSortOrder(value)}
    >
      <Text style={[styles.sortOptionText, { color: localSortOrder === value ? buttonTextColor : textColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSortModalVisible} 
      onRequestClose={() => setIsSortModalVisible(false)}
    >
      <Pressable style={styles.centeredView} onPress={() => setIsSortModalVisible(false)}>
        <Pressable style={[styles.modalView, { backgroundColor: cardBackgroundColor }]} onPress={(e) => e.stopPropagation()}>

          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Sort By</Text>
            <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
              <FontAwesome name="times" size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            {renderSortOption('Newest First', 'newest')}
            {renderSortOption('Price: Low to High', 'asc')}
            {renderSortOption('Price: High to Low', 'desc')}
            {renderSortOption('Popularity', 'popularity')}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.actionButton, styles.clearButton, { borderColor: borderColor }]} onPress={handleClear}>
              <Text style={[styles.actionButtonText, { color: tintColor }]}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.applyButton, { backgroundColor: tintColor }]} onPress={handleApply}>
              <Text style={[styles.actionButtonText, { color: buttonTextColor }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sortOptionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  clearButton: {
    borderWidth: 1,
  },
  applyButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});