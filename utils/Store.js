import { useReducer, createContext } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext();

// define initial state
const initialState = {
  cart: Cookies.get('cart') // replace default object -> search cookie in cart.
    ? JSON.parse(Cookies.get('cart')) // if it does exist use Json convert cart in their cookie.
    : { cartItems: [] }, // -> otherwise set cartItem to empty array.
};

function reducer(state, action) {
  // define switch case for check the action
  switch (action.type) {
    // if action.type is add to cart -> update the state and add item to the cart.
    case 'CART_ADD_ITEM': {
      const newItem = action.payload; //set new item from payload of that action
      // check existItem using find method
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      //if item is exist -> use map function on cartItems for check each item
      //if they are equal to the existItem we need update only quantity.
      //if not keep previous quantity item in the cartItem instead.
      //if item isn't exist ->  push nenwItem in carItem.
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]; // push newItem in cartItem in array
      Cookies.get('cart', JSON.stringify({ ...state.cart, cartItems })); // Object cannot save in cookie, need to convert to string first.
      return { ...state, cart: { ...state.cart, cartItems } }; //reducer function need return, keep previous state and update cart only.
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.get('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

// define StoreProvider React component
export function StroreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
