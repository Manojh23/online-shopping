import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ProductCard = ({ product, addToCart }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={product.image_url} alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          Quantity: {product.quantity}<br />
          Price: ${product.price}
        </Card.Text>
        <Button
          variant="primary"
          onClick={() => addToCart(product)}
          disabled={product.quantity === 0}
          className="mt-auto"
        >
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
