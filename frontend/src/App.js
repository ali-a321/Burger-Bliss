import './App.css';
import {Route, Routes,} from 'react-router-dom';
import Homepage from './pages/Homepage';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import { useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'

const Wrapper = ({children}) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children
} 

function App() {

  return (
    <div className="App">
      <Wrapper>
        <Routes>
          <Route exact path= '/' element ={<Homepage />} />
          <Route path= '/menu' element ={<Menu />} />
          <Route path= '/about' element ={<About />} />
          <Route path= '/contact' element ={<Contact />} />
          <Route path= '/order' element ={<Order />} />
          <Route path= '/admin' element ={<Admin />} />
          <Route path= '/checkout' element ={<Checkout />} />
        </Routes> 
      </Wrapper>   
    </div>

  );
}

export default App;
