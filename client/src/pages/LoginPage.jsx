import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Admin Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
               type="email" 
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="admin@cafe.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
               type="password" 
               id="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
