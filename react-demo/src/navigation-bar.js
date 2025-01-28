import React, {useEffect, useState} from 'react'
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavLink, UncontrolledDropdown } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import logo from './commons/images/icon.png';
import UserRegister from "./user/user/components/user-register";
import UserLogin from "./user/user/components/user-login";
import * as API_USERS from "./user/user/api/user-api";
import {jwtDecode} from 'jwt-decode';

const textStyle = {
    color: 'white',
    textDecoration: 'None',
    fontSize: '20px'
};

const buttonContainerStyle = {
    display: 'flex',
    marginLeft: '1150px',
    alignItems: 'center', 
};

function setToken(userToken) {
    sessionStorage.setItem('token', userToken); 
  }

function getRole() {
    return sessionStorage.getItem('role');  
}
  
  
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    return tokenString;
  }
  
  function removeToken() {
    sessionStorage.removeItem('token');
  }

function NavigationBar() {

    const [logout, setLogout] = useState(false);

    const [open, setOpen] = React.useState(false);
    const [openLogin, setOpenLogin] = React.useState(false);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);

    const [token, setTokenState] = React.useState(getToken());
    const [role, updateRole] = useState(getRole() || '');
    const [email, setEmail] = useState(getRole() || '' );
    const [name, setUserName] = useState('');

    const handleLogout = () => {
        removeToken();
        setTokenState(null);
        setLogout(true);
      };

      useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;
            const email = decodedToken.sub;
            updateRole(userRole);
            setEmail(email);
            fetchUserDetails(email);
        }
    }, [token]);

    function fetchUserDetails(email){
        API_USERS.getUserByEmail(email, (result, status, error) => {
            if (result !== null && status === 200) {
                setUserName(result.firstName);
                console.log("User data fetched successfully:", result);
            } else {
                console.error("Error fetching user data:", error);
            }
        });
    }

    return (
        <div>
            {logout && <Redirect to="/" />}

            <Navbar color="dark" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width={"50"}
                        height={"35"} />
                </NavbarBrand>
                <Nav className="mr-auto" navbar>

                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle style={textStyle} nav caret>
                            Menu
                        </DropdownToggle>
                        <DropdownMenu right >

                            <DropdownItem>
                                <NavLink href="/person">Persons</NavLink>
                            </DropdownItem>

                            <DropdownItem>
                                <NavLink href="/user">Users</NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink href="/device">Devices</NavLink>
                            </DropdownItem>
                            {token && (
                                <DropdownItem>
                                    <NavLink href="/my-devices">MyDevices</NavLink>
                                </DropdownItem>
                            )}
                            {token && (
                                <DropdownItem>
                                    <NavLink href="/chat">Chat</NavLink>
                                </DropdownItem>
                            )}

                        </DropdownMenu>
                    </UncontrolledDropdown>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginLeft: '1050px'}}>
                        {!token ? (
                            <>
                                <Button
                                    color="primary"
                                    style={{ fontSize: '18px', marginRight:'15px', width: '100px' }}
                                    onClick={handleOpenLogin}
                                >
                                    Login
                                </Button>
                                <Button
                                    color="primary"
                                    style={{ fontSize: '18px', marginLeft: '10px', width: '100px' }}
                                    onClick={handleOpen}
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                        {role === 'admin' ? `Welcome ${name} Admin!` : `Welcome ${name}!`}
                                    </span>
                                    <Button color="secondary" style={{ fontSize: '18px' }} onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                        )}
                    </div>
                </Nav>
            </Navbar>
            <UserRegister open={open} handleClose={handleClose} />
            <UserLogin open={openLogin} handleClose={handleCloseLogin} setToken={(token, role) => { 
                setToken(token, role); 
                setTokenState(token); 
                updateRole(role); 
            }} />
        </div>
    );
}

export default NavigationBar;
