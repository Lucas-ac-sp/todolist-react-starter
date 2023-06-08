import axios from "axios" 
const baseUrl = 'https://todo-list.alphacamp.io/api';


const axiosInstance = axios.create({
  baseURL: baseUrl
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    // 這段程式碼設定了請求的標頭屬性 "Authorization"，並將其值設定為以 "Bearer " 開頭，後面接著真實的授權令牌。這樣在發送請求時，服務端就可以使用這個授權令牌來驗證使用者的身分。
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config
},
(error) => {
  console.error(error)
})

export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`) 
    return res.data.data
  } catch (error) {
    console.error('[Get Todos failed]: ', error)
  }
}
export const createTodo = async (payload) => {
  const { title, isDone } = payload; 
  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone
    })
    return res.data
  } catch (error) {
    console.error('[Create Todo failed]: ', error);
  }
};
export const patchTodo = async (payload) => {
  const {id, title, isDone} = payload
  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone
    })
    return res.data
  } catch (error) {
    console.error('[Patch Todo failed]: ', error);
  }
};
export const deleteTodo = async (id) => {
  try {
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`)
    return res.data
  } catch (error) {
    console.error('[Delete Todo failed]: ', error);
  }
};