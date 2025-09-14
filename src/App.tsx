import {  useEffect } from 'react'
import './css/App.css'
import { Navigate, Route, Routes } from 'react-router'
import { Login } from './views/User/Login'
import { Unauthorized } from './views/Error/401'
import { NotFound } from './views/Error/404'
import { InternalServerError } from './views/Error/500'
import { Home } from './views/Home'
import { UserFiles } from './views/Home/UserFiles'


function App() {
  //const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(window.electron);
    // This effect runs once when the component mounts
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} key="login" />
        <Route path="/Home" element={<Home />} key="home">
           <Route path="/Home/Files" element={<UserFiles />} key="files"></Route>
        </Route>
        <Route path="/401" element={<Unauthorized />} key="401" />
        <Route path="/404" element={<NotFound />} key="404" />
        <Route path="/500" element={<InternalServerError />} key="500" />
        {/* Add more routes as needed */}
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
