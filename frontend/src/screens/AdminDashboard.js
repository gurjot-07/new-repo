import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActive = async (userId) => {
    try {
      // Update the isActive field in the backend
      await axios.put(`/users/${userId}/toggle-active`);

      // Update the state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (error) {
      console.error('Error toggling isActive:', error);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      // Update the role field in the backend
      await axios.put(`/users/${userId}/toggle-role`);

      // Update the state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, role: user.role === 'user' ? 'admin' : 'user' }
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling role:', error);
    }
  };

  return (
    <Container>
      <h2 style={styles.heading}>Administrator Dashboard</h2>

      <Row>
  {users.map((user) => (
    <Col key={user._id} md={6} lg={4} xl={3} className="mb-3">
      <Card>
        <Card.Body>
          <Card.Title>{user.email}</Card.Title>
          <hr />
          <Card.Subtitle className="mb-2 text-muted">Role: {user.role}</Card.Subtitle>
          <Button variant="warning" onClick={() => handleToggleRole(user._id)} className="ml-2">
            Change Role
          </Button>
          </Card.Body>
          <Card.Body>
          <Card.Text><strong>{user.isActive ? 'Activated' : 'Deactivated'}</strong></Card.Text>
          <Button variant="danger" onClick={() => handleToggleActive(user._id)}>
            Change Status
          </Button>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
      </Container>
  );
};

const styles = {
  container: {
    margin: '20px',
  },
  heading: {
    color: '#333',
    margin: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
};

export default AdminDashboard;
