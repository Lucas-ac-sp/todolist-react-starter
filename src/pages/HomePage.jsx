import { useAuth } from 'contexts/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { isAuthenticated, isAuthChecked } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthChecked) {
      console.log(
        `Home頁面Navigating to ${isAuthenticated ? '/todos' : '/login'}`,
      );
      navigate(isAuthenticated ? '/todos' : '/login');
    }
  }, [navigate, isAuthChecked, isAuthenticated]);

  return (
    <div>
      <p>正在導向相關頁面</p>
    </div>
  );
};

export default HomePage;
