import { StrictMode, useState } from "react";
//import { useNavigate} from "react-router-dom"
import axios from "axios";

//import { Button , Checkbox} from 'antd';
import './css/registrationForm.css'


function Login() {
 // const navigate = useNavigate()

  const [formData, setFormData] = useState({
    uUserName: '',
    email: '',
    Password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState((""))

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log (formData)
  };

  const handleUserLogin = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/login", formData).then ((res)=>{
      const id = res.data.id;
      const admin = res.data.admin;

      if(!localStorage.getItem("id")){
        localStorage.getItem("id", id)
        localStorage.getItem("sdmin", admin)
      }    
    
    window.location.href = "/"
    }).catch (err=> {
      setError(err.response.data.msg);
      console.log(err.response.data.msg)
    })
        
  };

  return (
    <StrictMode>
    <div className='form-container'>
      <form onSubmit={handleUserLogin} >
      {
       error? <p className="alert alert-danger text-center">{error}</p> :null
       }
      <h2>Login Form</h2>
     
        <div>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            placeholder='Email' 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <input 
            type="password" 
            name="Password" 
            value={formData.Password}
            placeholder='Password' 
            onChange={handleChange} 
            required 
          />
        </div>
       
        <br></br>
        <button type="submit" className='btn-register'>Login</button>
        <a href="http://localhost:3000/register" style={{ color: 'blue', textDecoration: 'none', marginLeft: "30px"}}>Singup</a>
      </form>
    </div>
    </StrictMode>
  );
}

export default Login;