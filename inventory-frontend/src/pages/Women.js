import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Row, Col, Alert } from 'react-bootstrap';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items/category/Women');
      setProducts(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching women products:', err.message);
      setError('Failed to fetch products.');
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantitySelected += 1;
    } else {
      cart.push({ ...product, quantitySelected: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div>
      <h2>Women's Collection</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {products.map(product => (
          <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
            <ProductCard product={product} addToCart={addToCart} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Women;
