import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getUnitPrice } from "@/utils/price";
import { MAX_CART_QUANTITY, MIN_CART_QUANTITY } from "./constants";

const initialState = {
    cartItems: [],
    loading: true,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Initialize from localStorage
        INIT: (state, action) => {
            state.cartItems = action.payload || [];
            state.loading = false;
        },

        // Add item to cart
        add: (state, action) => {
            const existing = state.cartItems.find(
                (item) => item.id === action.payload.id,
            );

            if (existing) {
                existing.quantity = Math.min(
                    existing.quantity + 1,
                    MAX_CART_QUANTITY,
                );
            } else {
                state.cartItems.push({
                    ...action.payload,
                    quantity: MIN_CART_QUANTITY,
                });
            }
        },

        // Remove item completely
        remove: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload,
            );
        },

        // Increase quantity
        increase: (state, action) => {
            const item = state.cartItems.find(
                (item) => item.id === action.payload,
            );

            if (item) {
                item.quantity = Math.min(item.quantity + 1, MAX_CART_QUANTITY);
            }
        },

        // Decrease quantity
        decrease: (state, action) => {
            const item = state.cartItems.find(
                (item) => item.id === action.payload,
            );

            if (item) {
                item.quantity = Math.max(item.quantity - 1, MIN_CART_QUANTITY);
            }
        },

        // Clear items
        clear: (state) => {
            state.cartItems = [];
        },
    },
});

export const { INIT, add, remove, increase, decrease, clear } =
    cartSlice.actions;

export default cartSlice.reducer;

// Cart items
export const selectCartItems = (state) => state.cart.cartItems;

// Loading
export const selectCartLoading = (state) => state.cart.loading;

// Number of items
export const selectTotalItems = createSelector([selectCartItems], (cartItems) =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
);

// Subtotal (uses the final unit price, discounted when there is a real discount)
export const selectSubtotal = createSelector([selectCartItems], (cartItems) =>
    cartItems.reduce(
        (sum, item) => sum + getUnitPrice(item) * item.quantity,
        0,
    ),
);

// Total price (kept for compatibility, prefer selectSubtotal)
export const selectTotalPrice = createSelector([selectCartItems], (cartItems) =>
    cartItems.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0),
);
