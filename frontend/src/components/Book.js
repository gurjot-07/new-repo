import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate  } from 'react-router-dom';
import { useUserContext } from './UserContext';

const Book = ({ book, onAddToCart ,onAddToWishlist }) => {

  const { isAuthenticated } = useUserContext();
  const isForSale = book.price !== "Not Available";

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigating to details when adding to cart
    onAddToCart(book.bookId, book.title, book.thumbnail, book.price);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation(); // Prevent navigating to details when adding to wishlist
    onAddToWishlist(book.bookId, book.title, book.thumbnail, book.price,book.author);
  };

 

  const navigateToDetails = () => {
    window.open(`/${book.bookId}`, '_blank');
  };

  return (
<Card className="bg-light" onClick={navigateToDetails} style={{ cursor: 'pointer' }}>
  <Card.Img variant="top" src={book.thumbnail} alt={book.title} style={{ height: '200px', objectFit: 'contain' }} />
  
  <Card.Body style={{ height: '175px', overflowY: 'auto' }}>
    <Card.Title>{book.title}</Card.Title>


    <Card.Text>Author: {book.author}</Card.Text>
    </Card.Body>
    <Card.Body>
    <Card.Text><strong>Price  </strong>{book.price}</Card.Text>
    </Card.Body>
    <Card.Body>
    {isAuthenticated && (
    <Button variant="success" block style={{ width: '100%' }} onClick={handleAddToCart} disabled={!isForSale}>
      Add to Cart
    </Button>
  )}
  {isAuthenticated && (
    <Button variant="danger" block style={{ width: '100%' }} className="mt-2" onClick={handleAddToWishlist} disabled={!isForSale}>
      Add to Wishlist
    </Button>
  )}
</Card.Body>
</Card>
  );
};

Book.propTypes = {
  book: PropTypes.shape({
    bookId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
};

export default Book;
