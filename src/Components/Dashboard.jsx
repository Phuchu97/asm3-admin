
import { useEffect, useState } from "react";
import DataGridDemo from "./Dashboard-table";
import '../css/home.css'

function DashboardComponent() {

  const [user, setUser] = useState(0);
  const [orders, setOrders] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [balance, setBalance] = useState(0);
  const [rowGrid, setRowGrid] = useState([]);
 
  useEffect(() => {
    // getUsers((res) => {
    //   if(res.statusCode === 200) {
    //     setUser(res.data.length);
    //   } else {
    //     alert(res.message);
    //   }
    // });
    // getListTransaction( async (res) => {
    //   if(res.statusCode === 200) {
    //     setRowGrid(res.data);
    //     setOrders(res.data.length);
    //     let totalEarn = await res.data.reduce((total, current) => {
    //       return total + current.price;
    //     },0);
    //     setBalance(res.balance);
    //     setEarnings(totalEarn);
    //   } else {
    //     alert(res.message)
    //   }
    // })
  }, []);

  return (
    <div className="dashboard">
      <div className="row ">
          <div className="col-3 header-item">
            <div className="header-item-content">
              <h6 className="header-item-content-title">USERS</h6>
              <p>{user}</p>
              <div className="header-item-content-icon">
                <span className="users-icon">
                  <i class="fa-regular fa-user"></i>
                </span>
              </div>
            </div>
          </div>

          <div className="col-3 header-item">
            <div className="header-item-content">
              <h6 className="header-item-content-title">ORDERS</h6>
              <p>{orders}</p>
              <div className="header-item-content-icon">
                <span className="orders-icon"><i class="fa-solid fa-cart-shopping"></i></span></div>
            </div>
          </div>

          <div className="col-3 header-item">
            <div className="header-item-content">
              <h6 className="header-item-content-title">EARNINGS</h6>
              <p>$ {earnings}</p>
              <div className="header-item-content-icon">
                <span className="earnings-icon"><i class="fa-solid fa-sack-dollar"></i></span>
              </div>
            </div>
          </div>

          <div className="col-3 header-item">
            <div className="header-item-content">
              <h6 className="header-item-content-title">BALANCE</h6>
              <p>$ {balance}</p>
              <div className="header-item-content-icon">
                <span className="balance-icon"><i class="fa-solid fa-scale-balanced"></i></span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="dashboard-content">
              <DataGridDemo rows={rowGrid} />
            </div>
          </div>
        </div>
    </div>
  );
}

export default DashboardComponent;