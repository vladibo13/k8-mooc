import React from 'react'
import TodosItem from './TodosItem'

const TodosList = ({todos}) => {
  return (
    <ul className="list-group mt-5">
        {todos.map(t => <TodosItem key={t.id}  todo={t} />)}
    </ul>
  )
}

export default TodosList