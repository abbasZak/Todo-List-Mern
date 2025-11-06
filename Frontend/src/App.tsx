import Register from "./Authentication/Register";
import Login from './Authentication/Login';
import HomePage from './MainPage/HomePage';
import { Routes, Route } from "react-router-dom";




function App() {
  
  
  
  return (

    <div >
      <Routes>
        <Route path="/" element={<Register />}></Route>
        <Route path="/Login" element={<Login />}></Route>  
        <Route path="/HomePage" element={<HomePage />}></Route>
      </Routes>
      
    </div>
  )
}

export default App
