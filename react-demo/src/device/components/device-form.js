import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import * as API_DEVICES from "../api/device-api";

function DeviceForm({ device, reloadHandler }) {
    const [formState, setFormState] = useState({
        description: '',
        address: '',
        maxHourEnergyConsumption: ''
    });

    useEffect(() => {
        if (device) {
            setFormState(device);
        }
    }, [device]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        if (device) {
            API_DEVICES.updateDevice(device.id, formState, reloadHandler);
        } else {
            API_DEVICES.postDevice(formState, reloadHandler);
        }
    };

    return (
        <Form>
            <FormGroup>
                <Label for="description">Description</Label>
                <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Enter device description..."
                    value={formState.description}
                    onChange={handleInputChange}
                />
            </FormGroup>
            <FormGroup>
                <Label for="address">Address</Label>
                <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter device address..."
                    value={formState.address}
                    onChange={handleInputChange}
                />
            </FormGroup>
            <FormGroup>
                <Label for="maxHourEnergyConsumption">Max Hour Energy Consumption</Label>
                <Input
                    type="text"
                    name="maxHourEnergyConsumption"
                    id="maxHourEnergyConsumption"
                    placeholder="Enter maximum hourly energy consumption..."
                    value={formState.maxHourEnergyConsumption}
                    onChange={handleInputChange}
                />
            </FormGroup>
            <Button color="primary" onClick={handleSubmit}>
                {device ? 'Update Device' : 'Add Device'}
            </Button>
        </Form>
    );
}

export default DeviceForm;
