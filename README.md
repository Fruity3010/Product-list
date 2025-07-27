README.md
E-commerce Product Listing App
Project Title
Create an e-commerce product listing page using React Native, incorporating filtering, sorting, and pagination functionalities.

Project Goal
Develop a mobile app with a user-friendly e-commerce product listing page using React Native. The app should allow users to browse through products, apply filters (e.g., category, price range), sort products based on different criteria, and support pagination for smooth navigation through the product catalog.

Context
In the fast-paced world of mobile commerce, providing users with a seamless shopping experience is crucial. This project aims to create an efficient product listing page within a mobile app, offering users the convenience of exploring and discovering products with ease. By incorporating filtering, sorting, and pagination features, the app can deliver a user-centric shopping experience.

Expectations
This project demonstrates expertise in React Native development, showcasing the ability to create a responsive and visually appealing e-commerce product listing page. It utilizes React Native components and Expo Router for smooth user interactions and navigation. Filtering and sorting functionalities are implemented to enable users to refine their search and find products based on their preferences. Pagination is integrated to manage large product catalogs efficiently. Clean code architecture and maintainable code practices have been prioritized throughout the development process.

Key Features
Product Listing: Displays a grid of products with images, titles, and prices.

Search: Real-time search functionality with debouncing for optimized performance, allowing users to find products by title.

Filtering:

Categories: Filter products by one or multiple selected categories.

Price Range: Filter products within a specified minimum and/or maximum price.

Active Filter Count: A badge on the filter button indicates how many filters are currently applied.

Sorting:

Sort products by Price (Low to High, High to Low).

Includes placeholder sort options for 'Newest First' and 'Popularity' which functions accordingly.

Pagination / Infinite Scroll: Efficiently loads more products as the user scrolls, improving performance and user experience for large catalogs.

Responsive Layout: The product grid adapts to different screen sizes and orientations (2, 3, or 4 columns).

Modals: Dedicated modals for a clean and intuitive filter and sort selection process.

Loading Indicators: Clear visual feedback for initial data loading, search processing, and pagination.

Technical Architecture and Design Choices
1. React Native & Expo Router
React Native: The framework for building native mobile applications using JavaScript and React.

Expo Router: A file-system based router for Expo and React Native, simplifying navigation setup and deep linking. It provides a structured way to define routes using directories and files, enabling features like nested layouts and modals.

2. Context API for State Management
The application uses React's Context API (specifically, ProductContext.tsx) for global state management.

Why Context API?

Avoids Prop Drilling: Instead of passing product data, search queries, filter settings, and update functions down through multiple layers of components, Context API allows any component wrapped by the ProductProvider to directly useProducts(). This keeps component trees cleaner and easier to manage.

Centralized Logic: All core data fetching, filtering, sorting, and pagination logic resides in the ProductContext. This makes it a single source of truth for product-related data, improving maintainability and reducing the chances of inconsistencies.

Performance Optimization (with useCallback and useEffect): By intelligently using useCallback for functions and useEffect with appropriate dependency arrays, expensive operations like filtering and sorting are only re-executed when necessary (e.g., when filter criteria actually change, not on every re-render). Debouncing on the search input further optimizes performance by delaying search execution until the user pauses typing.

3. Atomic Design Principles (Component-Based Architecture)
The project adheres to atomic design principles by breaking down the UI into small, reusable components.

How it's applied:

Atoms: ProductCard (a single product item), TabBarIcon, MenuButton, ShoppingCartButton. These are the fundamental building blocks.

Molecules: FilterModal, SortModal (combining inputs, buttons, and text).

Organisms: ProductListScreen (combining search bar, filter/sort buttons, and the FlatList of ProductCards).

This approach enhances reusability, maintainability, and scalability. Each component has a single responsibility, making debugging and future enhancements much simpler. For instance, the ProductCard can be reused anywhere a product needs to be displayed without knowing anything about its context.

4. Responsive Design
useWindowDimensions is used to dynamically adjust the number of columns in the FlatList based on the device's screen width, providing an optimal viewing experience across various devices (phones, tablets, web).

Major Project Structure
.
├── assets/                  // Fonts, images
├── components/              // Reusable UI components (ProductCard, Themed, navigation buttons)
├── context/                 // ProductContext (ProductContext.tsx)
├── app/                     // Expo Router routes
│   ├── (tabs)/              // Tab navigator group
│   │   ├── _layout.tsx      // Defines the Tabs layout
│   │   ├── index.tsx        // ProductListScreen (main product listing)
│   │   └── two.tsx          // Placeholder tab screen (e.g., Profile)
│   ├── _layout.tsx          // Root app layout, providers, global stack navigator
│   └── modal.tsx            // Example modal screen (e.g., shopping cart)
└── ... other config files (package.json, tsconfig.json, etc.)
How to Run the Project
Clone the repository:

Bash

git clone https://github.com/Fruity3010/Product-list.git
cd ecommerce-listing
Install dependencies:

Bash

npm install
# or
yarn install
Start the Expo development server:

Bash

npm start
# or
yarn start
Open on your device:

Scan the QR code with the Expo Go app (iOS or Android).

Run on an iOS simulator or Android emulator.

Run in a web browser (w in the terminal).

Demonstration
A demonstration video showcasing the app's key features, responsiveness, and user interactions will be provided with the submission.
