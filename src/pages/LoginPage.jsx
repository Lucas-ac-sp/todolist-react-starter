import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import  { useAuth }  from '../contexts/AuthContext'
import Swal from 'sweetalert2'

const LoginPage = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('Login頁面isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Login頁面Navigating to /todos');
      navigate('/todos');
    }
  }, [navigate, isAuthenticated]);

  const handleClick = async () => {
    if (username.length === 0) {
      return 
    }

    if (password.length === 0) {
      return
    }

    const success = await login({
      username,
      password
    })

    if (success) {
      // 登入成功訊息
      Swal.fire({
        position: 'top',
        title: '登入成功!',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
      });
      return;
    }

    // 登入失敗訊息
    Swal.fire({
      position: 'top',
      title: '登入失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  }

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label={"帳號"}
          value={username}
          placeholder={"請輸入帳號"}
          onChange={(nameInputValue) => setUserName(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label={"密碼"}
          value={password}
          placeholder={"請輸入密碼"}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick} >登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
