import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
  useRef,
} from 'react';

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
};

interface ProductContextType {
  products: Product[];
  loading: boolean;
  searchLoading: boolean;
  loadingMore: boolean;
  searchQuery: string;
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  sortOrder: 'asc' | 'desc' | 'newest' | 'popularity' | null;
  activeFilterCount: number;
  availableCategories: string[];

  setSearchQuery: (query: string) => void;
  setIsFilterModalVisible: (visible: boolean) => void;
  setIsSortModalVisible: (visible: boolean) => void;
  handleApplyFilter: (categories: string[], min: string, max: string) => void;
  handleApplySort: (sort: 'asc' | 'desc' | 'newest' | 'popularity' | null) => void;
  loadMore: () => void;
  isFilterModalVisible: boolean;
  isSortModalVisible: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const PAGE_SIZE = 10;
  const DEBOUNCE_DELAY = 500;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const searchTimeoutRef = useRef<number | null>(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'newest' | 'popularity' | null>(null);

  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(query);
    }, DEBOUNCE_DELAY);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('https://fakestoreapi.com/products');
      const data: Product[] = await res.json();
      setAllProducts(data);
      const uniqueCategories = [...new Set(data.map(p => p.category))].sort();
      setAvailableCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFiltersAndSort = useCallback(() => {
    let currentProducts = [...allProducts];

    if (debouncedSearchQuery) {
      currentProducts = currentProducts.filter(product =>
        product.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      currentProducts = currentProducts.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if ((!isNaN(min) && min >= 0) || (!isNaN(max) && max >= 0)) {
      currentProducts = currentProducts.filter(product => {
        const meetsMin = isNaN(min) || product.price >= min;
        const meetsMax = isNaN(max) || product.price <= max;
        return meetsMin && meetsMax;
      });
    }

    if (sortOrder) {
      currentProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.price - b.price;
        } else if (sortOrder === 'desc') {
          return b.price - a.price;
        }
        return 0;
      });
    }

    setFilteredAndSortedProducts(currentProducts);
    setPage(1);
    setProducts(currentProducts.slice(0, PAGE_SIZE));
  }, [allProducts, debouncedSearchQuery, selectedCategories, minPrice, maxPrice, sortOrder]);

  useEffect(() => {
    if (!loading && (debouncedSearchQuery !== searchQuery || selectedCategories.length > 0 || minPrice !== '' || maxPrice !== '' || sortOrder !== null)) {
      setSearchLoading(true);
      const searchSimulatedDelay = setTimeout(() => {
        applyFiltersAndSort();
        setSearchLoading(false);
      }, 700);

      return () => clearTimeout(searchSimulatedDelay);
    } else {
      applyFiltersAndSort();
    }
  }, [applyFiltersAndSort, debouncedSearchQuery, loading, selectedCategories, minPrice, maxPrice, sortOrder]);


  const loadMore = useCallback(() => {
    if (loadingMore || products.length >= filteredAndSortedProducts.length) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const nextItems = filteredAndSortedProducts.slice(0, endIndex);

    setTimeout(() => {
      setProducts(nextItems);
      setPage(nextPage);
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, products.length, filteredAndSortedProducts, page]);

  const handleApplyFilter = useCallback((categories: string[], min: string, max: string) => {
    setSelectedCategories(categories);
    setMinPrice(min);
    setMaxPrice(max);
    setIsFilterModalVisible(false);
  }, []);

  const handleApplySort = useCallback((sort: 'asc' | 'desc' | 'newest' | 'popularity' | null) => {
    setSortOrder(sort);
    setIsSortModalVisible(false);
  }, []);

  useEffect(() => {
    let count = 0;
    count += selectedCategories.length;
    if (minPrice !== '' && parseFloat(minPrice) >= 0) {
      count++;
    }
    if (maxPrice !== '' && parseFloat(maxPrice) >= 0) {
      count++;
    }
    setActiveFilterCount(count);
  }, [selectedCategories, minPrice, maxPrice]);


  const contextValue: ProductContextType = {
    products,
    loading,
    searchLoading,
    loadingMore,
    searchQuery,
    selectedCategories,
    minPrice,
    maxPrice,
    sortOrder,
    activeFilterCount,
    availableCategories,
    setSearchQuery: handleSearchQueryChange,
    setIsFilterModalVisible,
    setIsSortModalVisible,
    handleApplyFilter,
    handleApplySort,
    loadMore,
    isFilterModalVisible,
    isSortModalVisible,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};