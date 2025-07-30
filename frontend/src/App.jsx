import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MasterLayout from './components/MasterLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <MasterLayout>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"          element={<Home />} />
          <Route
        path="/create-post"
        element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        }
      />
        </Routes>
      </MasterLayout>
    </BrowserRouter>
  )
}