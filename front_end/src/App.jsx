import {Routes, Route} from 'react-router-dom'

import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Signup from './pages/SignUp'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/signUp' element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
