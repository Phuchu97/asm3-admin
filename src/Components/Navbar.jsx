import { useNavigate,Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import '../css/navbar.css';

function NavbarComponent() {

    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const [colorTitle, setColorTitle] = useState(true);
    const [switchNav, setSwitchNav] = useState(true);
    const [styleHeader, setStyleHeader] = useState({});
    const [numberScrollY, setNumberScrollY] = useState(0);


  const handleScrollHeader = () => {
    (window.scrollY > 45)? setSwitchNav(false) : setSwitchNav(true);
    if(window.scrollY > numberScrollY) {
      setNumberScrollY(window.scrollY);
    } else {
      setNumberScrollY(window.scrollY);
      setStyleHeader({
        backgroundColor: '#fff',
        color: 'black',
        boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px'
      })
    }
    if(window.scrollY === 0) {
      setStyleHeader({background: 'none'})
    }
  };


  window.addEventListener('scroll',handleScrollHeader);
        
    const clearUser = () => {
        localStorage.clear();
        navigate('/');
    };
  
  const moveToCart = () => {
    navigate('/home/checkout');
  };

  const moveToHistory = () => {
    navigate('/home/history');
  };
    
  const handleMouseMoveHeader = () => {
    setStyleHeader({
      backgroundColor: '#fff',
      color: 'black',
      boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    })
  }

  const handleMouseOutHeader = () => {
    if(window.scrollY < 80) {
      setStyleHeader({})
    }
  }

  const backHome = () => {
    setColorTitle(true);
    navigate('/home');
  };

  const moveToShop = () => {
    setColorTitle(false)
  };

  return (
    <div 
          className={switchNav? 'header' : 'header not-active-translate'} 
          style={styleHeader}
          onMouseMove={handleMouseMoveHeader}
          onMouseOut={handleMouseOutHeader}
        >
          <div className="header-name header-left">
            <h5 className="header-name-item" onClick={backHome} style={{color: colorTitle? '#f2da98' : ''}}>Dashboard</h5>
          </div>

          <div className='header-logo'>
            <h3>ADMIN</h3>
          </div>

          <div className="header-user header-right">
            <div className="header-user-item header-right-flex" onClick={moveToHistory}>
              <div className="header-user-item-icon"><i class="fa-regular fa-circle-user"></i></div>
              <p className="header-user-item-name">{username}</p>
            </div>
            <div className="header-user-item " onClick={clearUser}>
              <p className="header-user-item-logout">Logout</p>
            </div>
          </div>
        </div>
  );
}

export default NavbarComponent;