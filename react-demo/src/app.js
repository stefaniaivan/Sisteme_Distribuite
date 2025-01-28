import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavigationBar from './navigation-bar';
import Home from './home/home';
import PersonContainer from './person/person-container';
import UserContainer from './user/user/user-container';
import DeviceContainer from './device/device-container';
import MyDevicesContainer from './device/my-devices-container';
import Chat from './chat/chat'
import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import { jwtDecode } from 'jwt-decode';

/*
    Namings: https://reactjs.org/docs/jsx-in-depth.html#html-tags-vs.-react-components
    Should I use hooks?: https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both
*/

function App() {

    const isAuthenticated = () => sessionStorage.getItem('token') !== null;
    const isAdmin = () => {
        const token = sessionStorage.getItem('token');
        const decodedToken = jwtDecode(token); 
        const userRole = decodedToken.role; 
        return userRole === 'admin'; 
    };
    
    return (
        <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home />}
                        />

                        <Route
                            exact
                            path='/person'
                            render={() => <PersonContainer />}
                        />

                        <Route
                            exact
                            path='/user'
                            render={() => isAuthenticated() && isAdmin() ? (
                                <UserContainer />
                            ) : (
                                <Redirect to='/' />
                            )}
                        />
                        <Route
                            exact
                            path='/device'
                            render={() => isAuthenticated() && isAdmin() ? (
                                <DeviceContainer />
                            ) : (
                                <Redirect to='/' />
                            )}
                        />

                        <Route
                            exact
                            path='/my-devices'
                            render={() => isAuthenticated() ? (
                                <MyDevicesContainer />
                            ) : (
                                <Redirect to='/' />
                            )}
                        />

                        <Route 
                            exact
                            path='/chat'
                            render={() => isAuthenticated() ? (
                                <Chat />
                            ) : (
                                <Redirect to='/' />
                            )}
                        />

                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage />}
                        />

                        <Route render={() => <ErrorPage />} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
