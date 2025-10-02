import React from 'react'

const TodosItem = ({todo}) => {
  return (
   <li className="list-group-item mt-3">{todo.title}</li>
  )
}

export default TodosItem