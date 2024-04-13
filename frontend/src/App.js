import './App.css';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Nav from './components/nav';
//import Homepage from './components/homepage';
import RegistrationForm from "./components/RegistrationForm"
import Admin from './components/Admin';
import Login from './components/Login';
import { useEffect, useState } from 'react';
function App() {
const [id, setId] = useState('')
const [admin, setAdmin] = useState('')

useEffect(()=>{
if(localStorage.getItem("id")){
  setId(localStorage.getItem("id"))
  setAdmin(localStorage.getItem("admin"))
} else{
  setId("")
  setAdmin("")
}
}, [])
  return (
    <div className="App">
      <BrowserRouter>
            
     
      <Routes>
        
          <Route path="/admin" element={admin?<Admin/>:<Navigate to="/"/> } />
          <Route path="/login" element={id?<Navigate to="/"/> :<Login/>} />
          <Route path="/register" element={id?<Navigate to="/"/> :<RegistrationForm/>} />
          <Route path="/help" component={Nav} />
          
          <Route path="/shoppingbag" component={Nav} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
