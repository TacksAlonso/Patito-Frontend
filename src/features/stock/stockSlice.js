import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    items: [],
  },
  reducers: {
    setStockItems(state, action) {
      state.items = action.payload;
    },
    updateStockItem(state, action) {
      const { productId, newQuantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
          item.availability = 'Out of Stock';
        }
      }
    },
  },
});

export const { setStockItems, updateStockItem } = stockSlice.actions;
export default stockSlice.reducer;
