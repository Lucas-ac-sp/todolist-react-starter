import { createContext, useState, useEffect, useContext } from 'react'
import { login, register, checkPermission } from '../api/auth';
import * as jwt from 'jsonwebtoken'
import { useLocation } from 'react-router-dom'


const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  isAuthChecked: false, // 令牌驗證已檢查
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, //註冊方法
  login: null, // 登入方法
  logout: null, //登出方法
};

const AuthContext = createContext(defaultAuthContext);
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // isAuthChecked驗證狀態已檢查，但不代表令牌是否已經通過後端的 checkPermission(authToken)驗證。
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      // 如果 authToken 不存在，代表身分驗證未通過
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        setIsAuthChecked(true);
        return;
      }
      // 如果 authToken 存在，呼叫 checkPermission(authToken) 檢查有效性
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
      setIsAuthChecked(true);
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthChecked,
        currentMember: payload && {
          // sub 是一個保留的聲明（claim），代表 JWT 的主題（subject）這裡可以做為使用者 id
          id: payload.sub,
          name: payload.name, // 取出使用者帳號
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
  
