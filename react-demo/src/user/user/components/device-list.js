import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


function DeviceListModal({ isOpen, toggle, devices, onDeviceSelect, onSubmit }) {
    console.log(devices);
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Available Devices</ModalHeader>
            <ModalBody>
                <ul>
                    {devices.length > 0 ? (
                        devices.map(device => (
                            <li key={device.id}>
                                <strong>{device.description}</strong>
                                <div>
                                    <p>Specifications:</p>
                                    <p>Address: {device.address}</p>
                                    <p>Maximum Hourly Energy Consumption: {device.maxHourEnergyConsumption}</p>
                                </div>
                                <Button 
                                    color="primary" 
                                    onClick={() => onDeviceSelect(device)} 
                                >
                                    Select
                                </Button>
                            </li>
                        ))
                    ) : (
                        <li>No devices available</li>
                    )}
                </ul>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
                <Button color="primary" onClick={onSubmit} disabled={!devices}>Submit</Button>
            </ModalFooter>
        </Modal>
    );
}



export default DeviceListModal;