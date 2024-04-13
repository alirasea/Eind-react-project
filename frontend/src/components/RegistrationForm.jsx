import { StrictMode, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom"
import './css/registrationForm.css'


function RegistrationForm() {
  const [formData, setFormData] = useState({
    UserName: '',
    email: '',
    Password: '',
    phoneNumber: ''
  });
const navigate = useNavigate()

 
  const [error, setError] = useState("")



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log (formData)
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/post_formData", formData);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response.data.error);
      console.log(err.response.data.error)
    }
  }
  
  
  

  return (
<StrictMode>
  <section>
    <div className='form-container'>
      <form onSubmit={handleSubmit} >
       {
       error? <p className="alert alert-danger text-center">{error}</p> :null
       }
      <h2>Registration Form</h2>
        <div>
          <input 
            type="text" 
            name="UserName" 
            value={formData.UserName}
            placeholder='Username' 
            onChange={handleChange} 
            required 
          />
        </div>
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
        <div>
          <input 
            type="tel" 
            name="phoneNumber" 
            value={formData.phoneNumber}
            placeholder='phoneNumber' 
            onChange={handleChange} 
            required 
          />
        </div>
        <br></br>
        <button type="submit" className='btn-register'>Register</button>
        <a href="http://localhost:3000/login" style={{ color: 'blue', textDecoration: 'none', marginLeft: "30px"}}>Login</a>

      </form> 
    </div>
  </section>
</StrictMode>
  );
}

export default RegistrationForm; 