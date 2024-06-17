// Cart selectors
// export const getCartItems = (state) => state.cart.cartItems;

export const getCart = (state) => state.cart;

// user selectors
export const getUserInfo = (state) => state.user?.info;
export const getToken = (state) => state.user?.token;

// product selectors
export const getMinPriceFilter = (state) => state.product.filter.minPrice;
export const getMaxPriceFilter = (state) => state.product.filter.maxPrice;

export const getCategoriesFilter = (state) => state.product.filter.categories;
export const getPriceRangeFilter = (state) => state.product.filter.priceRange;
export const getStatusFilter = (state) => state.product.filter.status;

// review selectors
export const getRatingFilter = (state) => state.review.ratingFilter;
export const getSortFilter = (state) => state.review.sortFilter;
export const getPage = (state) => state.review.page;
