import axios from 'axios';
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext  } from '../components/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  image: {
    maxWidth: '100%',
    height: '400px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailsContainer: {
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  author: {
    marginBottom: '10px',
  },
  description: {
    marginBottom: '15px',
  },
  publisher: {
    marginBottom: '10px',
  },
  publishedDate: {
    marginBottom: '20px',
  },
};

const ViewBookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [isForSale, setForSale] = useState(null);
  const { isAuthenticated , userInfo } = useUserContext();
  
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('paarms ',bookId, book.title, book.imageLinks.thumbnail, book.price);
    addToCartHandler(bookId, book.title, book.imageLinks.thumbnail, book.price);
    
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    addToWishlistHandler(book.bookId, book.title, book.thumbnail, book.price, book.author);
  };

  const addToCartHandler = async (bookId, bookTitle, bookImage, price) => {
    price = 10;
    console.log("Adding to cart with price:", price);
    console.log("params:", bookImage);
    try {
      let userId;

      if (isAuthenticated) {
        userId = userInfo.user.email;
      } else {
        console.log('User is not signed in. Show a login modal or redirect to the login page.');
        return;
      }

      const response = await axios.post("/cart/create", {
        userId,
        bookId,
        quantity: 1,
        title: bookTitle,
        image: bookImage,
        price: price,
      });

      console.log("Book added to cart:", response.data);
      navigate('/cart');
    } catch (error) {
      console.error("Error adding book to cart:", error.message);
    }
  };

  const addToWishlistHandler = async (bookId, bookTitle, bookImage, price, author) => {
    try {
      price = 10;
      let userId;
      if (isAuthenticated) {
        userId = userInfo.user.email;
      } else {
        console.log('User is not signed in. Show a login modal or redirect to the login page.');
        return;
      }

      const existingWishlist = localStorage.getItem('wishlist');
      const wishlist = existingWishlist ? JSON.parse(existingWishlist) : [];

      const isBookInWishlist = wishlist.some(
        (item) => item.userId === userId && item.bookId === bookId
      );

      if (!isBookInWishlist) {
        wishlist.push({
          userId,
          bookId,
          title: bookTitle,
          author: author,
          thumbnail: bookImage,
          price: price,
        });

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log("Book added to booklist :", wishlist);
      } else {
        console.log("Book is already in the booklist for this user:", bookTitle);
      }
    } catch (error) {
      console.error("Error adding book to wishlist:", error.message);
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        console.log(response);
        setBook(response.data.volumeInfo);
        if (response.data.saleInfo.saleability === "NOT_FOR_SALE") {
          setForSale(false);
        } else {
          setForSale(true);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return <div>Loading...</div>; 
  }


  
  return (
    
    <div style={styles.container}>
      {book.imageLinks && book.imageLinks.thumbnail && (
        <div style={styles.imageContainer}>
          <img src={book.imageLinks.thumbnail} alt={book.title} style={styles.image} />
        </div>
      )}
      <div style={styles.detailsContainer}>
        <h1 style={styles.title}>{book.title}</h1>
        <p style={styles.author}><strong>Author:</strong> {book.authors && book.authors.join(', ')}</p>
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
  <hr/>
        
        <div style={styles.description}>
          <strong>User Rating:</strong><p style={styles.author}>{book.averageRating}/5 ({book.ratingsCount})</p>
        </div>
        <hr/>
        <div style={styles.description}>
          <strong>Description:</strong>
          <p dangerouslySetInnerHTML={{ __html: book.description }} />
        </div>
        <hr/>
        <p style={styles.publisher}><strong>Pages:</strong> {book.pageCount} </p>
        <p style={styles.publisher}><strong>Category:</strong> {book.categories}</p>
        <p style={styles.publisher}><strong>Publisher:</strong> {book.publisher}</p>
        <p style={styles.publishedDate}><strong>Published Date:</strong> {book.publishedDate}</p>
      </div>
    </div>
  );
};

export default ViewBookDetails;