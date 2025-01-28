import React, { useState, useEffect } from 'react';
import { Col, Row, FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import * as API_USERS from "../api/user-api";

const formControlsInit = {
    firstName: {
        value: '',
        placeholder: 'What is your first name?...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 3,
            isRequired: true
        }
    },
    lastName: {
        value: '',
        placeholder: 'What is your last name?...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 3,
            isRequired: true
        }
    },
    email: {
        value: '',
        placeholder: 'What is your email?...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 3,
            isRequired: true
        }
    },
    role: {
        value: '',
        placeholder: 'What is your role, client or admin?...',
        valid: false,
        touched: false,
        validationRules: {
            allowedValues: ['client', 'admin'],
            isRequired: true
        }
    },
    password: {
        value: '',
        placeholder: 'Enter your password...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 6,
            isRequired: true
        }
    }
};

function UserForm(props) {
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [formIsValid, setFormIsValid] = useState(false);
    const [formControls, setFormControls] = useState(formControlsInit);

    useEffect(() => {
        if (props.user) {
            setFormControls({
                firstName: { ...formControls.firstName, value: props.user.firstName },
                lastName: { ...formControls.lastName, value: props.user.lastName },
                email: { ...formControls.email, value: props.user.email},
                role: { ...formControls.role, value: props.user.role },
                password: { ...formControls.password, value: '' }  
            });
            setFormIsValid(true);
        }
    }, [props.user]);

    function registerUser(user) {
        return API_USERS.postUser(user, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted user with id: " + result);
                props.reloadHandler();
            } else {
                setError({ status: status, errorMessage: err });
            }
        });
    }

    function updateUser(user) {
        return API_USERS.updateUser(user.id, user, (result, status, err) => {
            if (result !== null && status === 200) {
                console.log("Successfully updated user with id: " + user.id);
                props.reloadHandler();
            } else {
                setError({ status: status, errorMessage: err });
            }
        });
    }

    function handleSubmit() {
        let user = {
            firstName: formControls.firstName.value,
            lastName: formControls.lastName.value,
            email: formControls.email.value,
            role: formControls.role.value,
            password: formControls.password.value
        };

        if (props.user && props.user.id) {
            user.id = props.user.id;  
            updateUser(user);
        } else {
            registerUser(user);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
    
        let updatedControls = { ...formControls };
        let updatedFormElement = updatedControls[name];
    
        updatedFormElement.value = value;
        updatedFormElement.touched = true;
    
        if (name === 'role') {
            updatedFormElement.valid = ['client', 'admin'].includes(value.trim());
        } else if (name === 'password') {
            updatedFormElement.valid = value.trim().length >= 6;
        } else {
            updatedFormElement.valid = value.trim().length >= 3;
        }
    
        updatedControls[name] = updatedFormElement;
        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }
    
        setFormControls(updatedControls);
        setFormIsValid(formIsValid);
    }

    return (
        <div>
            <FormGroup id='firstName'>
                <Label for='firstNameField'> First Name: </Label>
                <Input name='firstName' id='firstNameField' placeholder={formControls.firstName.placeholder}
                    onChange={handleChange}
                    value={formControls.firstName.value}
                    touched={formControls.firstName.touched ? 1 : 0}
                    valid={formControls.firstName.valid}
                    required
                />
                {formControls.firstName.touched && !formControls.firstName.valid &&
                    <div className={"error-message row"}> * First name must have at least 3 characters </div>}
            </FormGroup>

            <FormGroup id='lastName'>
                <Label for='lastNameField'> Last Name: </Label>
                <Input name='lastName' id='lastNameField' placeholder={formControls.lastName.placeholder}
                    onChange={handleChange}
                    value={formControls.lastName.value}
                    touched={formControls.lastName.touched ? 1 : 0}
                    valid={formControls.lastName.valid}
                    required
                />
                {formControls.lastName.touched && !formControls.lastName.valid &&
                    <div className={"error-message row"}> * Last name must have at least 3 characters </div>}
            </FormGroup>

            <FormGroup id='email'>
                <Label for='emailField'> Email: </Label>
                <Input name='email' id='emailField' placeholder={formControls.email.placeholder}
                    onChange={handleChange}
                    value={formControls.email.value}
                    touched={formControls.email.touched ? 1 : 0}
                    valid={formControls.email.valid}
                    required
                />
                {formControls.email.touched && !formControls.email.valid &&
                    <div className={"error-message row"}> * Email must have at least 3 characters </div>}
            </FormGroup>

            <FormGroup id='role'>
                <Label for='roleField'> Role: </Label>
                <Input name='role' id='roleField' placeholder={formControls.role.placeholder}
                    onChange={handleChange}
                    value={formControls.role.value}
                    touched={formControls.role.touched ? 1 : 0}
                    valid={formControls.role.valid}
                    required
                />
                {formControls.role.touched && !formControls.role.valid &&
                    <div className={"error-message row"}> * Role must be either client or admin </div>}
            </FormGroup>

            <FormGroup id='password'>
                <Label for='passwordField'> Password: </Label>
                <Input name='password' id='passwordField' type='password' placeholder={formControls.password.placeholder}
                    onChange={handleChange}
                    value={formControls.password.value}
                    touched={formControls.password.touched ? 1 : 0}
                    valid={formControls.password.valid}
                    required
                />
                {formControls.password.touched && !formControls.password.valid &&
                    <div className={"error-message row"}> * Password must have at least 6 characters </div>}
            </FormGroup>

            <Row>
                <Col sm={{ size: '4', offset: 8 }}>
                    <Button type={"submit"} onClick={handleSubmit}>
                        {props.user && props.user.id ? 'Update' : 'Submit'}
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default UserForm;
