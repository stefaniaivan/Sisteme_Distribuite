import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import DeviceForm from "./components/device-form";
import * as API_DEVICES from "./api/device-api";
import DeviceTable from "./components/device-table";
import { jwtDecode } from 'jwt-decode';


function DeviceContainer() {
    const [isSelected, setIsSelected] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [error, setError] = useState({ status: 0, errorMessage: null });

    const [role, setRole] = useState(sessionStorage.getItem('role') || '');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role || '');
        }

        fetchDevices();
    }, []);

    function fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {
            if (result !== null && status === 200) {
                setTableData(result);
                setIsLoaded(true);
            } else {
                setError({ status: status, errorMessage: err });
            }
        });
    }

    function toggleForm(device = null) {
        setSelectedDevice(device);
        setIsSelected((prev) => !prev);
    }

    function reload() {
        setIsLoaded(false);
        toggleForm();
        fetchDevices();
    }

    const handleUpdate = (device) => {
        API_DEVICES.updateDevice(device.id, device, (result, status, err) => {
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
                <strong> Device Management </strong>
            </CardHeader>
            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <Button color="primary" onClick={() => toggleForm(null)} disabled={role !== 'admin'}>Add Device</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        {isLoaded && <DeviceTable tableData={tableData} setTableData={setTableData} role={role} toggleForm={toggleForm} />}
                        {error.status > 0 && <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />}
                    </Col>
                </Row>
            </Card>

            <Modal isOpen={isSelected} toggle={() => toggleForm(null)} size="lg">
                <ModalHeader toggle={() => toggleForm(null)}>
                    {selectedDevice ? 'Update Device' : 'Add Device'}
                </ModalHeader>
                <ModalBody>
                    <DeviceForm reloadHandler={reload} device={selectedDevice} />
                </ModalBody>
            </Modal>
        </div>
    );
}

export default DeviceContainer;
