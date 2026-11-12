import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';

const Navbar = () => {
  const cartItemCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Clothing Store</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/men">Men</Nav.Link>
            <Nav.Link as={Link} to="/women">Women</Nav.Link>
            <Nav.Link as={Link} to="/kids">Kids</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/cart">
              Cart <Badge bg="secondary">{cartItemCount}</Badge>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
