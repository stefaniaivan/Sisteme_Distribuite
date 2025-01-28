import React, { useState } from 'react';
import { Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import * as API_USERS from '../api/user-api';

const formControlsInit = {
    lastName: {
        value: '',
        placeholder: 'Introduce last name...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 2,
            isRequired: true
        }
    },
    firstName: {
        value: '',
        placeholder: 'Introduce first name...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 2,
            isRequired: true
        }
    },
    email: {
        value: '',
        placeholder: 'Introduce your email address...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true,
            isEmail: true
        }
    },
    password: {
        value: '',
        placeholder: 'Introduce password...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 6,
            isRequired: true
        }
    }
};

function UserRegister({ open, handleClose }) {
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [formIsValid, setFormIsValid] = useState(false);
    const [formControls, setFormControls] = useState(formControlsInit);

    function registerUser(user) {
        return API_USERS.postUser(user, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully registered user with id: " + result);
                handleClose(); 
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        });
    }

    function handleSubmit() {
        const user = {
            lastName: formControls.lastName.value,
            firstName: formControls.firstName.value,
            email: formControls.email.value,
            password: formControls.password.value,
            role: "client"
        };
        registerUser(user);
    }

    function handleChange(event) {
        const { name, value } = event.target;

        let updatedControls = { ...formControls };
        let updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;

        const isValid = value.trim().length >= (updatedFormElement.validationRules.minLength || 0);
        updatedFormElement.valid = isValid;

        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        setFormControls(updatedControls);
        setFormIsValid(formIsValid);
    }

    return (
        <Modal isOpen={open} toggle={handleClose}>
            <ModalHeader toggle={handleClose}>Registration Form</ModalHeader>
            <ModalBody>
                <FormGroup id='lastName'>
                    <Label for='lastNameField'> Last Name: </Label>
                    <Input name='lastName' id='lastNameField' placeholder={formControls.lastName.placeholder}
                        onChange={handleChange}
                        defaultValue={formControls.lastName.value}
                        touched={formControls.lastName.touched ? 1 : 0}
                        valid={formControls.lastName.valid}
                        required
                    />
                    {formControls.lastName.touched && !formControls.lastName.valid &&
                        <div className={"error-message row"}> * Last Name must be at least 2 characters long * </div>}
                </FormGroup>

                <FormGroup id='firstName'>
                    <Label for='firstNameField'> First Name: </Label>
                    <Input name='firstName' id='firstNameField' placeholder={formControls.firstName.placeholder}
                        onChange={handleChange}
                        defaultValue={formControls.firstName.value}
                        touched={formControls.firstName.touched ? 1 : 0}
                        valid={formControls.firstName.valid}
                        required
                    />
                    {formControls.firstName.touched && !formControls.firstName.valid &&
                        <div className={"error-message row"}> * First Name must be at least 2 characters long * </div>}
                </FormGroup>

                <FormGroup id='email'>
                    <Label for='emailField'> Email: </Label>
                    <Input name='email' id='emailField' placeholder={formControls.email.placeholder}
                        onChange={handleChange}
                        defaultValue={formControls.email.value}
                        touched={formControls.email.touched ? 1 : 0}
                        valid={formControls.email.valid}
                        required
                    />
                    {formControls.email.touched && !formControls.email.valid &&
                        <div className={"error-message row"}> * Email address is mandatory * </div>}
                </FormGroup>

                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input name='password' id='passwordField' placeholder={formControls.password.placeholder}
                        type='password'
                        onChange={handleChange}
                        defaultValue={formControls.password.value}
                        touched={formControls.password.touched ? 1 : 0}
                        valid={formControls.password.valid}
                        required
                    />
                    {formControls.password.touched && !formControls.password.valid &&
                        <div className={"error-message row"}> * Password must have at least 6 characters * </div>}
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" disabled={!formIsValid} onClick={handleSubmit}>Register</Button>
                <Button color="secondary" onClick={handleClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}

export default UserRegister;
