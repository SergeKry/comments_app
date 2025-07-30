import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MasterLayout from './components/MasterLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <MasterLayout>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"          element={<Home />} />
        </Routes>
      </MasterLayout>
    </BrowserRouter>
  )
}