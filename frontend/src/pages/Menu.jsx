import React, { useEffect, useState } from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import signatureBurger from "../images/signature.webp"
import axios from 'axios'; 
import comboImg from "../images/combomain.png"
import sidesImg from "../images/sides.png"
import milksmallImg from "../images/milksmall.png"
import milkbigImg from "../images/milkbig.png"
import { useNavigate } from 'react-router';

function Menu() {

  const [menuData, setMenuData] = useState([]);
  const [burgerMenuData, setBurgerMenuData] = useState([]);
  const [sandwichMenuData, setSandwichMenuData] = useState([]);
  const [milkshakeMenuData, setMilkshakeMenuData] = useState([]);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get('http://localhost:8000/burger/menu/get')
      .then((response) => {
        setMenuData(response.data);
        
      setBurgerMenuData(response.data.filter((item) => item.category_name === "Burgers"));
      setSandwichMenuData(response.data.filter((item) => item.category_name === "Sandwiches"));
      setMilkshakeMenuData(response.data.filter((item) => item.category_name === "Milkshakes"));
      setSideMenuData(response.data.filter((item) => item.category_name === "Sides"));
      
      
    })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  }, []);

  const groupMenuItemsByCategory = (menuData) => {
    const excludedCategories = ['Burgers', 'Sandwiches', 'Milkshakes', 'Sides'];
    const groupedMenu = {};
  
    menuData.forEach((item) => {
      const { category_name } = item;
      if (!excludedCategories.includes(category_name)) {
        if (!groupedMenu[category_name]) {
          groupedMenu[category_name] = [];
        }
        groupedMenu[category_name].push(item);
      }
    });
  
    return groupedMenu;
  }
  const groupedMenu = groupMenuItemsByCategory(menuData);

  const openOrder = () => {
    navigate("/order")
  }

  return (
    <div>
        <Header/>
        <div className='signatureContainer'>
          <div className='signatureTitle'> Signature Burgers </div>
          <img src={signatureBurger} alt='our three signature burgers' className='signatureBurgers'/>
          <div className='burgerNameContainer'> 
           
            {burgerMenuData.map((burger) => (
            <div className="burgerInfo" key={burger.food_id}>
              <img src={burger.food_picture} className='burgerPicture' alt={burger.food_name}/>
              <div className="burgerTitle">{burger.food_name}</div>
              <div className="burgerDescription">{burger.descriptions}</div>
              <div className="burgerPrice">${burger.price}</div>
            </div>
          ))}

          </div>
          <div className='sandwichTitle'> Sandwiches </div>
          <div className='sandwichNameContainer'> 
          {sandwichMenuData.map((burger) => (
            <div className="burgerInfo" key={burger.food_id}>
              <img src={burger.food_picture} className='burgerPicture' alt={burger.food_name} loading='lazy'/>
              <div className="burgerTitle">{burger.food_name}</div>
              <div className="burgerDescription">{burger.descriptions}</div>
              <div className="sandwichPrice">${burger.price}</div>
            </div>
          ))}
          </div>
          <div className='center'>
          <div className='orderBtnContainer' onClick={()=> openOrder()}> 
              <div className='menuBtnHome'> Order Now </div>
            </div>
            </div>
           <div className='comboContainer'>  
            <div className='combo'> 
            <div className='comboTitle'> Make it a combo </div>
            <div className='comboText'> 
            Create your combo with any burger or sandwich from our menu. Pair it with your choice of sides, including French fries, tornado fries, onion rings, poutine, sweet potato fries, mac & cheese bites, or jalapeno poppers. Don't forget to grab a refreshing drink to complete your meal.
            </div>
            </div>
            <img src={comboImg} alt='burger, fries, and pepsi' className='comboImg' loading='lazy'/>
           
          </div>
          <div className='sidesTitle'> SIDES  </div>
          <img src={sidesImg} alt='sides at burger bliss' className='sidesImg' loading='lazy'/>
          <div className='sandwichNameContainer'> 
          {sideMenuData.map((side) => (
            <div className="burgerInfo" key={side.food_id}>
              <div className="burgerTitle">{side.food_name}</div>
              <div className="burgerDescription">{side.descriptions}</div>
              <div className="sandwichPrice">${side.price}</div>
            </div>
          ))}
          </div>
          <div>
      {Object.entries(groupedMenu).map(([category, items]) => (
        <div key={category}>
          <div className="sidesTitle">{category}</div>
          <div className="sandwichNameContainer">
            {items.map((menuItem) => (
              <div className="burgerInfo" key={menuItem.food_id}>
               {menuItem.food_picture ?  
               <img src={menuItem.food_picture} className="menuPicture" alt={menuItem.food_name} loading='lazy'
                /> : ""}
              
                <div className="burgerTitle">{menuItem.food_name}</div>
                <div className="burgerDescription">{menuItem.descriptions}</div>
                <div className="sandwichPrice">${menuItem.price}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
          <div className='sidesTitle'> MILKSHAKES  </div>
          <div className='milkPriceTitle'> $5.99</div>
          <img src={milkbigImg} alt='milkshakes at burger bliss' className='milkbigImg' loading='lazy'/>
          <img src={milksmallImg} alt='milkshakes at burger bliss' className='milksmallImg' loading='lazy'/>

        </div>

        <Footer/>
    </div>
  )
}

export default Menu