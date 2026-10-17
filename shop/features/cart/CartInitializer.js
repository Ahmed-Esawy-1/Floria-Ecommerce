"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INIT } from "./cartSlice";

export default function CartInitializer({ children }) {
    const dispatch = useDispatch();
    const { cartItems, loading } = useSelector((state) => state.cart);

    // Load from localStorage
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("cartItems"));
            dispatch(INIT(stored));
        } catch (error) {
            console.error("Error loading cart:", error);
            dispatch(INIT([]));
        }
    }, [dispatch]);

    // Save to localStorage
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems, loading]);

    return children;
}
