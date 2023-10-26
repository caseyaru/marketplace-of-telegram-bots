/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';
import './Cart.css';
import CartItem from './CartItem/CartItem';
import CartEmpty from './CartEmpty/CartEmpty';
// import CartTemp from './CartTemp';

function Cart({ isAuthorized }) {
  // const dispatch = useDispatch();
  const {
    items
  } = useSelector((state) => state.dataCart);

  return (
    <section className='cart'>
      {items.length !== 0 ? (
        <CartItem />
      ) : (
        <CartEmpty isAuthorized={isAuthorized} />
      )}
    </section>
  );
}

export default Cart;
