import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import { Navbar, Form, FormGroup, FormControl, Button } from "react-bootstrap";
import '../css/login.css';
import TextField from '@mui/material/TextField';
import { loginPage,registerAccount } from "../Services/LoginService";

function LoginComponent() {
    const navigate = useNavigate();
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
  
    const IsRegister = () => {
      // Logic to handle registration
      setIsRegisterOpen(!isRegisterOpen);
    };

    const callbacklogin = (data) => {
      if(data.statusCode === 200) {
        alert('Đăng nhập thành công');
        localStorage.userId = data.userId;
        localStorage.role = data.role;
        localStorage.username = data.username;
        localStorage.token = data.token;
        navigate('/home');
      } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    }

    const callbackRegister = (res) => {
      console.log(res);
        if(res.statusCode === 200) {
          IsRegister();
        } else {
            alert('Có lỗi trong quá trình xử lý!');
        }
    }

    async function HandleRegister() {
        try {
          await registerAccount(callbackRegister, {
            username: usernameRegister,
            password: passwordRegister
          })
        } catch {
          alert('Có lỗi trong quá trình đăng nhập!')
        }
      };

    async function handleLogin() {
      // Logic to handle login
      try {
        await loginPage(callbacklogin, {
          username: username,
          password: password
        })
      } catch {
        alert('Có lỗi trong quá trình đăng nhập!')
      }
    };
  
    return (
      <div className="login">
        <div className="login-box">
          {/* <Navbar>
            <Navbar.Brand>Login Page</Navbar.Brand>
          </Navbar> */}
          {isRegisterOpen ? (
            <Form className="form-middle">
            <h1>Register</h1>
            <FormGroup className="form-middle-group">
              {/* <label className="form-middle-label" htmlFor="">Username</label> */}
              <TextField 
                  id="filled-basic" 
                  label="Username" 
                  variant="filled" 
                  className='form-input-add input-login'
                  onChange={(e) => setUsernameRegister(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="form-middle-group">
              {/* <label className="form-middle-label" htmlFor="">Password</label> */}
              <TextField 
                  id="filled-basic" 
                  label="Password"
                  type="password"
                  variant="filled" 
                  className='form-input-add input-login'
                  onChange={(e) => setPasswordRegister(e.target.value)}
              />
            </FormGroup>
            <button className="button-submit" onClick={HandleRegister}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              confirm
            </button>
            <div className="text-register">
              Go back? <a onClick={IsRegister} href="#">Login</a>
            </div>
          </Form>
          ) : (
            <Form className="form-middle">
              <h1>Login</h1>
              <FormGroup className="form-middle-group">
                {/* <label className="form-middle-label" htmlFor="">Username</label> */}
                <TextField 
                    id="filled-basic" 
                    label="Username" 
                    variant="filled" 
                    className='form-input-add input-login'
                    onChange={(e) => setUsername(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="form-middle-group">
                {/* <label className="form-middle-label" htmlFor="">Password</label> */}
                <TextField 
                    id="filled-basic" 
                    label="Password"
                    type="password"
                    variant="filled" 
                    className='form-input-add input-login'
                    onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
              <div className="button-submit" onClick={handleLogin}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                submit
              </div>
              <div className="text-register">
              Do you need a new account? <a onClick={IsRegister} href="#">Register</a>
              </div>
            </Form>
          )}
        </div>
      </div>
    );
}

export default LoginComponent;