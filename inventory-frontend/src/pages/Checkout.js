import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantitySelected), 0).toFixed(2);
  };

  const handleCheckout = () => {
    // In a real application, you'd handle payment processing here.
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="text-center">
        <h2>Thank you for your purchase!</h2>
        <Link to="/">
          <Button variant="primary">Go Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <h2>Your cart is empty.</h2>;
  }

  return (
    <div>
      <h2>Checkout</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price (Each)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantitySelected}</td>
              <td>${item.price}</td>
              <td>${(item.price * item.quantitySelected).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3"><strong>Total</strong></td>
            <td><strong>${calculateTotal()}</strong></td>
          </tr>
        </tbody>
      </Table>
      <Button variant="success" onClick={handleCheckout}>Place Order</Button>
    </div>
  );
};

export default Checkout;
