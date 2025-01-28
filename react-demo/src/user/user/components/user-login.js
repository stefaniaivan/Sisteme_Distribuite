import React, { useState } from 'react';
import { Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import * as API_USERS from '../api/user-api';

function UserLogin({ open, handleClose, setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        };

        API_USERS.loginUser(user, (result, status, err) => {
            if (result && (status === 200 || status === 201)) {
                const {token} = result;
                setToken(token);
                setError(null);
                handleClose(); 
            } else {
                setError(err.message || 'Login failed! Please try again.');
            }
        });
    };

    return (
        <Modal isOpen={open} toggle={handleClose}>
            <ModalHeader toggle={handleClose}>Login Form</ModalHeader>
            <ModalBody>
                <FormGroup id='email'>
                    <Label for='emailField'> Email: </Label>
                    <Input 
                        name='email' 
                        id='emailField' 
                        placeholder="Introduce your email address..."
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </FormGroup>

                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input 
                        name='password' 
                        id='passwordField' 
                        placeholder="Introduce password..."
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </FormGroup>

                {error && <div className={"error-message row"}> * {error} * </div>} 
            </ModalBody>
            <ModalFooter>
                <Button color="primary" disabled={!email || !password} onClick={handleLogin} >Login</Button>
                <Button color="secondary" onClick={handleClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}

export default UserLogin;
