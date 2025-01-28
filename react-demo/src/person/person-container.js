import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import PersonForm from "./components/person-form";
import * as API_USERS from "./api/person-api";
import PersonTable from "./components/person-table";

function PersonContainer(props) {
    const [isSelected, setIsSelected] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    // Store error status and message in the same object because we don't want 
    // to render the component twice (using setError and setErrorStatus)
    // This approach can be used for linked state variables.
    const [error, setError] = useState({ status: 0, errorMessage: null });

    // componentDidMount
    useEffect(() => {
        fetchPersons();
    }, []);

    function fetchPersons() {
        return API_USERS.getPersons((result, status, err) => {
            if (result !== null && status === 200) {
                setTableData(result);
                setIsLoaded(true);
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        });
    }

    function toggleForm(person = null) {
        setSelectedPerson(person);
        setIsSelected((isSelected) => (!isSelected));
    }

    function reload() {
        setIsLoaded((isLoaded) => (false));

        toggleForm();
        fetchPersons();
    }

    const handleUpdate = (person) => {
        const updatedPerson = {
            id: person.id,
            name: person.name,
            email: person.email,
            age: person.age,
            address: person.address
        };
        API_USERS.updatePerson(updatedPerson, (result, status, err) => {
            if (result) {
                reload(); 
            } else {
                setError({ status: status, errorMessage: err });
            }
        });
    };

    return (
        <div>
            <CardHeader style={{ fontSize: '24px', fontWeight: 'bold' }}>
                <strong> Person Management </strong>
            </CardHeader>
            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <Button color="primary" onClick={toggleForm}>Add Person </Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        {isLoaded && <PersonTable tableData={tableData} setTableData={setTableData} toggleForm={toggleForm} />}
                        {error.status > 0 &&
                            <APIResponseErrorMessage
                                errorStatus={error.status}
                                error={error.errorMessage}
                            />}
                    </Col>
                </Row>
            </Card>

            <Modal isOpen={isSelected} toggle={toggleForm} size="lg">
    <ModalHeader toggle={toggleForm}>
        {selectedPerson ? 'Update Person' : 'Add Person'}
    </ModalHeader>
    <ModalBody>
        <PersonForm 
            reloadHandler={reload} 
            person={selectedPerson} 
        />
    </ModalBody>
</Modal>

        </div>
    );

}

export default PersonContainer;
