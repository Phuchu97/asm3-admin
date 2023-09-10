import { Outlet, useNavigate,Link } from "react-router-dom";
import { useEffect } from 'react';
import NavbarComponent from "./Navbar";
import '../css/home.css'

function HomeComponent() {

  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = localStorage.getItem('token');
    if(!checkToken) {
      alert('You must to login!');
      navigate('/')
    }
  },[])
  const handleLogout = () => {
    localStorage.clear();
    navigate('/')
  }
  return (
    <div className="home row">
      <NavbarComponent/>
      <div className="col-2 home-left sidebar dashboard-header">
        <div className="main sidebar-item">
          <div className="main-title"><h5>MAIN</h5></div>
          <Link to={'/home'} style={{textDecoration: 'none'}}>
            <div className="main-item">
              <div className="main-item-icon"><i class="fa-solid fa-chart-line"></i></div>
              <h6>Dashboard</h6>
            </div>
          </Link>
        </div>

        <div className="row sidebar-item sidebar-list">
          <div><h5>LISTS</h5></div>
          <ul className="list-title">
            <Link to={'/home/slides'} className="list-title-item">
              <i class="fa-regular fa-user"></i>
              Slides
            </Link>
            <li className="list-title-item">
              <Link to={'/home/categories'} style={{textDecoration: 'none'}}>
                <i class="fa-solid fa-hotel"></i>
                Categories
              </Link>
            </li>
            <li className="list-title-item">
              <Link to={'/home/products'} style={{textDecoration: 'none'}}>
                <i class="fa-solid fa-person-shelter"></i>
                Products
              </Link>
            </li>
            {/* <li className="list-title-item">
              <Link to={'/home/transaction'} style={{textDecoration: 'none'}}>
                <i class="fa-solid fa-truck-fast"></i>
                Transactions
              </Link>
            </li> */}
          </ul>
        </div>

        {/* <div className="row sidebar-item sidebar-list">
          <h5>NEW</h5>
          <ul className="list-title">
            <li className="list-title-item">
              <Link to={'/home/hotels/hotel-add'} style={{textDecoration: 'none'}}>
                <i class="fa-solid fa-hotel"></i>
                New Hotel
              </Link>
            </li>
            <li className="list-title-item">
              <Link to={'/home/category-add'} style={{textDecoration: 'none'}}>
                <i class="fa-solid fa-person-shelter"></i>
                New Category
              </Link>
            </li>
          </ul>
        </div> */}
      </div>

      <div className="col-10 home-right dashboard-header">
        <div className="top"></div>
        <Outlet/>
      </div>
    </div>
  );
}

export default HomeComponent;