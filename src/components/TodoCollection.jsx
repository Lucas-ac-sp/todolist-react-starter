import TodoItem from './TodoItem';

const TodoCollection = ({
  todos,
  onSave,
  onDelete,
  onToggleDone,
  onChangeMode
}) => {
  return (
    <div>
      {todos.map((todo) => {
        return <TodoItem 
        key={todo.id} 
        todo={todo} 
        onToggleDone={(id) => onToggleDone?.(id)}
        onSave={({id, title}) => onSave?.({id, title})}
        onChangeMode={({id, isEdit}) => onChangeMode?.({id, isEdit})}
        onDelete={(id) => onDelete?.(id)}
        />
      })}
    </div>
  );
};

export default TodoCollection;
