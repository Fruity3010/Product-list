import React from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TextInput,
  useWindowDimensions,
} from "react-native";
import ProductCard from "@/components/ProductCard";
import FilterModal from "@/components/FilterModal";
import SortModal from "@/components/SortModal";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "@/components/Themed";
import { useProducts } from "@/context/ProductContext";

export default function ProductListScreen() {
  const {
    products,
    loading,
    searchLoading,
    loadingMore,
    searchQuery,
    activeFilterCount,
    setSearchQuery,
    setIsFilterModalVisible,
    setIsSortModalVisible,
    loadMore,
    isFilterModalVisible,
    isSortModalVisible,
  } = useProducts();
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const buttonTextColor = useThemeColor({}, "buttonText");
  const placeholderTextColor = useThemeColor({}, "placeholderText");
  const borderColor = useThemeColor({}, "border");
  const getNumColumns = () => {
    if (width >= 1024) {
      return 4;
    } else if (width >= 768) {
      return 3;
    } else {
      return 2;
    }
  };

  const numColumns = getNumColumns();

  const renderFooter = () => {
    if (!loadingMore || products.length === 0) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={tintColor} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: cardBackgroundColor },
        ]}
      >
        <FontAwesome
          name="search"
          size={20}
          color={textColor}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search products..."
          placeholderTextColor={placeholderTextColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchLoading && (
          <ActivityIndicator size="small" color={tintColor} style={styles.searchLoadingIndicator} />
        )}
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            {
              backgroundColor: cardBackgroundColor,
              borderColor: borderColor,
            },
          ]}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <FontAwesome name="sliders" size={16} color={textColor} />
          <Text style={[styles.headerButtonText, { color: textColor }]}>
            Filter
          </Text>
          {activeFilterCount > 0 && (
            <View style={[styles.badge, { backgroundColor: tintColor }]}>
              <Text style={[styles.badgeText, { color: buttonTextColor }]}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.headerButton,
            {
              backgroundColor: cardBackgroundColor,
              borderColor: borderColor,
            },
          ]}
          onPress={() => setIsSortModalVisible(true)}
        >
          <FontAwesome name="sort-amount-desc" size={16} color={textColor} />
          <Text style={[styles.headerButtonText, { color: textColor }]}>
            Sort
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={tintColor}
          style={{ marginTop: 50 }}
        />
      ) : searchLoading && products.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={tintColor}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          key={numColumns}
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !searchLoading && products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: textColor }]}>
                  No products found.
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <FilterModal />
      <SortModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchLoadingIndicator: {
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 8,
  },

  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    position: "relative",
    width: "48%",
  },
  headerButtonText: {
    fontWeight: "600",
    marginLeft: 5,
    alignContent: "center",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontStyle: "italic",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});