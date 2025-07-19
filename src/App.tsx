import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import { Navigate, Route, Routes } from 'react-router'
import { Login } from './views/User/Login'
import { Register } from './views/User/Register'


function App() {
 //const [count, setCount] = useState(0)

  useEffect(() => {
     console.log(window.electron);
    // This effect runs once when the component mounts
  }, [])

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/Login" replace /> } />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>














  {/* Uncomment the following lines to display logos and a button
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>*/}
    </>
  )
}

export default App
