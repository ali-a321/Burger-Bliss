import React, { useState } from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer';
import axios from 'axios';
import greenCheck from "../images/greenCheck.png"
function Contact() {
  const [formSubmitted, setformSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, message } = formData; 
  
    try {
      const response = await axios.post('http://localhost:8000/burger/contact/add', {
        name,
        email,
        message,
      });
  
      if (response.status === 201) {
        console.log('Message submitted successfully');
        setFormData({ name: '', email: '', message: '' });
        setformSubmitted(true)
      } else {
        console.error('Failed to submit message');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };
  

  return (
    <div>
      <Header/>
    <div className='contactContainer'>
      <div className='contactText'> If you have inquiries, ideas to share, thoughts to express, or even grievances to voice, kindly complete the form provided below, and rest assured, we'll reach out to you promptly.</div>
      <div className="contact-form-container">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder='Name'
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>
          <div className="form-group">
            <input
              placeholder='Email'
              type="email"
              id="email"
              name="email"
              maxLength={100}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={400}
              required
            ></textarea>
          </div>
          {!formSubmitted ? 
          <button className='contactSubmitBtn' type="submit">Submit</button>
          : <div className='contactSubmitted'> 
            <img src={greenCheck} alt='green checkmark' className='greenCheck'/>
            Submitted 
            </div> }
        </form>
      </div>
     
      </div>
      <Footer/>
    </div>
  );
}

export default Contact