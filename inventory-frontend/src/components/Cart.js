import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantitySelected), 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return <h2>Your cart is empty.</h2>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price (Each)</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantitySelected}</td>
              <td>${item.price}</td>
              <td>${(item.price * item.quantitySelected).toFixed(2)}</td>
              <td>
                <Button variant="danger" onClick={() => removeFromCart(item.id)}>Remove</Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3"><strong>Total</strong></td>
            <td colSpan="2"><strong>${calculateTotal()}</strong></td>
          </tr>
        </tbody>
      </Table>
      <Link to="/checkout">
        <Button variant="success">Proceed to Checkout</Button>
      </Link>
    </div>
  );
};

export default Cart;
