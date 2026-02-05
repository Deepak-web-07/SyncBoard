import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import About from './components/About/About.jsx'
import Home from './components/Home/Home.jsx'
import Signup from './components/signup/Signup.jsx'
import Signin from './components/signIn/Signin.jsx'
import Logout from './components/logout/Logout.jsx'
import Todo from './components/todo/Todo.jsx'
import { Provider } from 'react-redux'
import { store } from './App/store.js'

import BoardDashboard from './components/board/BoardDashboard.jsx'
import JoinBoard from './components/board/JoinBoard.jsx'

import ErrorPage from './components/ErrorPage.jsx'
import { Navigate } from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<ErrorPage />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='dashboard' element={<BoardDashboard />} />
      <Route path='board/:boardId' element={<Todo />} />
      <Route path='join/:inviteCode' element={<JoinBoard />} />
      <Route path='signup' element={<Signup />} />
      <Route path='signin' element={<Signin />} />
      <Route path='logout' element={<Logout />} />
      <Route path='*' element={<Navigate to="/dashboard" replace />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)
