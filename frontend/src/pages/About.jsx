import React from 'react'
import Header from '../components/Header'
import aboutBurger from "../images/aboutpicmain.webp"
import aboutBurgerOne from "../images/aboutpic.webp"
import Footer from "../components/Footer"

function About() {
  return (
    <div>
      <Header/>
      
      <div className='aboutContainer'>
        <div className='firstAbout'> 
        Welcome to Burger Bliss, where we're on a passionate quest to craft extraordinary smashed burgers that ignite a culinary symphony on your taste buds. While our Spicy Mozazarella Fiesta burgers have certainly earned their well-deserved acclaim, our menu is a delectable expedition, boasting an array of mouthwatering options. From the savory allure of our flavour explosion sandwich to the sheer satisfaction of our Tornado Fries, each dish is an invitation to satisfy your every craving.
        </div>
        <div className='secondAbout'>
        Here at Burger Bliss, we hold ourselves to the highest standards, beginning with the very essence of our creations, our ingredients. Our commitment lies in sourcing the freshest, top-quality components. Every patty is crafted from house-ground beef, and our produce is thoughtfully selected from local sources, ensuring that each burger is not just a meal but a masterpiece of flavor and quality.
        Join us at Burger Bliss for a burger experience unlike any other, where every bite transcends the ordinary and elevates your senses to burger heaven.
        </div>
        <img src={aboutBurger} alt='burger' className='aboutMainBurger'/>
       
        <div className='thirdAbout'> 
        Burger Bliss has etched its name as a beloved culinary haven in Toronto. Our cherished patrons have come to anticipate not just a meal but an enchanting dining experience, characterized by impeccable service and a menu that embraces the diversity of flavors to cater to every palate.
        </div>
        <div className='fourthAbout'> 
        At Burger Bliss, our culinary journey is steered by an unyielding commitment to innovation. Our ingenious kitchen brigade ceaselessly explores uncharted territories in the realm of burger craftsmanship, fearlessly experimenting with an array of flavors and ingredients. This relentless pursuit ensures that every visit to Burger Bliss promises a delightful and unexpected culinary voyage, where you'll always stumble upon a unique and enticing addition to our menu. Join us in this exciting exploration of flavors!
        </div>
    <img src={aboutBurgerOne} alt='burger being cooked' className='cookedBurgerImg'/>
       
      </div>
      <Footer/>
    </div>
  )
}

export default About