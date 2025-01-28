import React from "react";
import { useState, useEffect } from "react";
import Table from "../../../commons/tables/table";
import * as API_USERS from "../api/user-api";
import * as API_DEVICES from "../../../device/api/device-api";
import DeviceListModal from './device-list';

function UserTable(props) {
    const { userTableData, setUserTableData, toggleForm, role } = props;
    const [devices, setDevices] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        fetchDevices(); 
    }, []);

    const fetchDevices = () => {
        API_DEVICES.getDevices((result, status, err) => {
            if (status === 200 && result) {
                setDevices(result); 
            } else {
                console.error("Error:", err);
            }
        });
    };

    const handleAddDevice = (userId) => {
        setSelectedUserId(userId); 
        setIsModalOpen(true); 
    };

    const handleDeviceSelect = (device) => {
        console.log("Selected device:", device);
        setSelectedDevice(device); 
    };

    const handleDeviceSubmit = () => {
        if (selectedDevice) {
            console.log(`Device selected for user ${selectedUserId}:`, selectedDevice);
            
            API_DEVICES.addDeviceToUser(selectedUserId, selectedDevice.id, (result, status, err) => {
                if (status === 200 && result) {
                    console.log("The device has been added:", result);
                    setIsModalOpen(false);
                    
                } else {
                    console.error("Error:", err);
                }
            });
        }
    };
    


    const columns = [
        {
            Header: 'First name',
            accessor: 'firstName',
        },
        {
            Header: 'Last name',
            accessor: 'lastName',
        },
        {
            Header: 'Role',
            accessor: 'role',
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                return (
                    <div>
                        <button style={{ backgroundColor: 'red', color: 'white', border: 'red', padding: '8px 16px', borderRadius: '4px' }} onClick={() => handleDelete(row._original.id)} disabled={role !== 'admin'}>Delete</button>
                        <button style={{ backgroundColor: 'forestgreen', color: 'white', border: 'green', padding: '8px 16px', borderRadius: '4px' }} onClick={() => props.toggleForm(row._original)} disabled={role !== 'admin'}>Update</button>
                        <button style={{ backgroundColor: 'orange', color: 'white', border: 'orange', padding: '8px 16px', borderRadius: '4px' }} disabled={role !== 'admin'} onClick={() => handleAddDevice(row._original.id)} >Add device</button>
                    </div>
                );
            }
        }
    
    ];

    const filters = [
        {
            accessor: 'lastName',
        }
    ];


    function handleDelete(id) {
        API_USERS.deleteUser({ id: id }, () => {
            console.log(`User-ul cu ID-ul ${id} a fost șters.`);
            const updatedTableData = props.userTableData.filter(user => user.id !== id);
            console.log("Datele actualizate ale tabelului:", updatedTableData);
            props.setUserTableData(updatedTableData);
        });
    }

    return (
        <>
        <Table
            data={props.userTableData}
            columns={columns}
            search={filters}
            pageSize={5}
            key={props.userTableData.map(user => user.id).join()}
        />
        <DeviceListModal
                isOpen={isModalOpen}
                toggle={() => setIsModalOpen(!isModalOpen)}
                devices={devices} 
                onDeviceSelect={handleDeviceSelect}
                onSubmit={handleDeviceSubmit}
            />
        </>
    );
}

export default UserTable;