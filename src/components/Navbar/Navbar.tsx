import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  if (loading) return null; // Evita renderizar a Navbar enquanto carrega os dados

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">TechChallenge</Link>
      </div>
      <ul className="navbar-links">

          <li>
            <Link to="/admin">Admin</Link>
          </li>
        
        <li className="navbar-auth">
          <button
            onClick={handleAuthAction}
            className="auth-button"
            aria-label={isAuthenticated ? 'Logout' : 'Login'}
          >
            {isAuthenticated ? <FaUserCircle size={50} /> : <FaSignInAlt size={24} />}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
