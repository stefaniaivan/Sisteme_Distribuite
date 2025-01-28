import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import * as API_USERS from "./api/user-api";
import UserTable from "./components/user-table";
import UserForm from "./components/user-form";
import {jwtDecode} from 'jwt-decode';

function getToken() {
    const tokenString = sessionStorage.getItem('token');
    return tokenString;
}

function getRole() {
    return sessionStorage.getItem('role');  
}

function UserContainer() {
    const [userIsSelected, setUserIsSelected] = useState(false);
    const [userTableData, setUserTableData] = useState([]);
    const [userIsLoaded, setUserIsLoaded] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [error, setError] = useState({ status: 0, errorMessage: null });

    //const [role, setRole] = useState(sessionStorage.getItem('role') || '');

    const [role, updateRole] = useState(getRole() || '');

    const [token, setTokenState] = React.useState(getToken());

    console.log("Role in UserContainer: ", role);

    useEffect(() => {
            if (token) {
                const decodedToken = jwtDecode(token);
                const userRole = decodedToken.role;
                updateRole(userRole);
            }
        }, [token]);

    useEffect(() => {
        const handleStorageChange = () => {
            updateRole(sessionStorage.getItem('role') || '');
        };

        window.addEventListener('storage', handleStorageChange);
        fetchUsers();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    function fetchUsers() {
        return API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                console.log(result);
                setUserTableData(result);
                setUserIsLoaded(true);
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        });
    }


    function toggleForm(user = null) {
        setSelectedUser(user);
        setUserIsSelected((userIsSelected) => (!userIsSelected));
    }

    function reload() {
        setUserIsLoaded((userIsLoaded) => (false));

        toggleForm();
        fetchUsers();
    }

    return (
        <div>
            <CardHeader style={{ fontSize: '24px', fontWeight: 'bold' }}>
                <strong> User Management </strong>
            </CardHeader>
            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <Button color="primary" onClick={toggleForm} disabled={role !== 'admin'}>Add User </Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col sm={{ size: '10', offset: 1 }}>
                        {userIsLoaded && <UserTable userTableData={userTableData} setUserTableData={setUserTableData} toggleForm={toggleForm} role={role} reloadHandler={reload} />}
                        {error.status > 0 &&
                            <APIResponseErrorMessage
                                errorStatus={error.status}
                                error={error.errorMessage}
                            />}
                    </Col>
                </Row>
            </Card>

            <Modal isOpen={userIsSelected} toggle={toggleForm} size="lg">
                <ModalHeader toggle={toggleForm}>
                </ModalHeader>
                <ModalBody>
                    <UserForm
                        reloadHandler={reload}
                        user={selectedUser}
                    />
                </ModalBody>
            </Modal>
        </div>
    );

}

export default UserContainer;