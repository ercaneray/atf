import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import DeviceDetail from './pages/DeviceDetail'


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices/:serial" element={<DeviceDetail />} />
      </Routes>
    </>
  )
}

export default App
