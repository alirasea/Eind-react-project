import { StrictMode, useState } from "react";



import './css/registrationForm.css'


function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    telephone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add your logic for submitting the form data
    console.log(formData);
  };

  return (
    <StrictMode>
    <div className='form-container'>
      <form onSubmit={handleSubmit} >
      <h2>Registration Form</h2>
        <div>
          <input 
            type="text" 
            name="username" 
            value={formData.username}
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
            name="password" 
            value={formData.password}
            placeholder='Password' 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <input 
            type="tel" 
            name="telephone" 
            value={formData.telephone}
            placeholder='Telephone' 
            onChange={handleChange} 
            required 
          />
        </div>
        <br></br>
        <button type="submit" className='btn-register'>Register</button>
      </form>
    </div>
    </StrictMode>
  );
}

export default RegistrationForm;

