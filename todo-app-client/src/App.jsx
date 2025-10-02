import { useState, useEffect } from 'react'
import todosService from './services/todos'
import TodosList from './components/TodosList'

function App() {
  const [title, setTitle] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await todosService.get()
      setTodos(todos)
    }

    fetchTodos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTodo = await todosService.create({
      title: e.target.value,
      completed: false
    })
    const updatedTodos = todos.map(t => t.id !== newTodo.id ? t : newTodo)
    console.log(`Submitted title: ${title}`);
    setTodos(updatedTodos)
    setTitle(""); // clear input after submit
  };
  console.log(todos)
  return (
    <>
      <h1 className='mt-5 text-center'>Todo App</h1>
      <div className="container mt-5">
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        {title && (
          <p className="mt-3">
            <strong>Live preview:</strong> {title}
          </p>
        )}
        <TodosList todos={todos} />
        <img className='mt-3' src="/media/image.jpg" width={600} height={400} alt="Cached from PV" />
      </div>
    </>
  )
}

export default App
