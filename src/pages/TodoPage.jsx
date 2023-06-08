import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react'
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext' 

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (value) => {
    setInputValue(value)
  }

  const [todos, setTodos] = useState([])

  const todoNums = todos.length
  const navigate = useNavigate()
  const { isAuthenticated, isAuthChecked, currentMember } = useAuth();

  useEffect(() => {
    // 情況1發生在當 localStorage 中沒有驗證令牌時，表示用戶尚未通過驗證。
    // 情況2發生在當 localStorage 中存在驗證令牌，但該令牌未能通過後端的 checkPermission(authToken) 驗證
    if (isAuthChecked && !isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated, isAuthChecked]);

  useEffect(() => {
    const getTodoAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error(error);
      }
    }
    getTodoAsync()
  }, [])

  const handleAddTodo = async () => {
    if(inputValue.length === 0) {
      return
    }
      
    try {
      const { id, title, isDone } = await createTodo({
        title: inputValue,
        isDone: false,
      })


      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id,
            title,
            isDone,
            isEdit: false
          }
        ]
      })
      setInputValue('');
    } catch (error) {
      console.error(error)
    }
  }

  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return
    }

    try {
      const { id, title, isDone } = await createTodo({
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id,
            title,
            isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  }

  const handleToggleDone = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id)
    try {
      await patchTodo({
        id, 
        isDone: !currentTodo.isDone
      })
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error)
    }


  }

  const handleSave = async ({id, title}) => {
    try {
      await patchTodo({
        id,
        title
      })
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error)
    }
    
  }

  const handleChangeMode = ({id, isEdit}) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit
          }
        }

        return {...todo, isEdit: false}
      })
    })
  }

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id)
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name}/>
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection 
      todos={todos} 
      onToggleDone={handleToggleDone}
      onSave={handleSave}
      onChangeMode={handleChangeMode}
      onDelete={handleDelete}
      />
      <Footer numOfTodos={todoNums}/>
    </div>
  );
};



export default TodoPage;
