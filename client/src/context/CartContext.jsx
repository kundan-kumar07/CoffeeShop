import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/react";
import api from "../services/api.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await getToken();

        if (!token) {
          return;
        }

        const response = await api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const items = response.data.items.map((item) => ({
          ...item,
          id: item.product_id,
        }));

        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [getToken]);

  const addToCart = async (product) => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      const response = await api.post(
        "/cart/items",
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const savedItem = response.data.item;

      setCartItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.id === savedItem.product_id,
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === savedItem.product_id
              ? {
                  ...item,
                  quantity: savedItem.quantity,
                }
              : item,
          );
        }

        return [
          ...currentItems,
          {
            ...product,
            quantity: savedItem.quantity,
          },
        ];
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const increaseQuantity = async (productId) => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      const currentItem = cartItems.find((item) => item.id === productId);

      if (!currentItem) {
        return;
      }

      const newQuantity = currentItem.quantity + 1;

      const response = await api.patch(
        `/cart/items/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedItem = response.data.item;

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: updatedItem.quantity,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      const currentItem = cartItems.find((item) => item.id === productId);

      if (!currentItem) {
        return;
      }

      if (currentItem.quantity === 1) {
        await api.delete(`/cart/items/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems((currentItems) =>
          currentItems.filter((item) => item.id !== productId),
        );

        return;
      }

      const newQuantity = currentItem.quantity - 1;

      const response = await api.patch(
        `/cart/items/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedItem = response.data.item;

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: updatedItem.quantity,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
