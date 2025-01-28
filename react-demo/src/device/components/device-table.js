import React from "react";
import Table from "../../commons/tables/table";
import * as API_DEVICES from "../api/device-api";

function DeviceTable(props) {
    const {role, showCheckButton, onShowChart} = props;
    const columns = [
        { Header: 'Description', accessor: 'description' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Max Hour Energy Consumption', accessor: 'maxHourEnergyConsumption' },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div>
                    {role === 'admin' && (
                        <>
                            <button style={{ backgroundColor: 'red', color: 'white', border: 'red', padding: '8px 16px', borderRadius: '4px' }} onClick={() => handleDelete(row._original.id)} disabled={role !== 'admin'}>Delete</button>
                            <button style={{ backgroundColor: 'green', color: 'white', border: 'green', padding: '8px 16px', borderRadius: '4px' }} onClick={() => props.toggleForm(row._original)} disabled={role !== 'admin'}>Update</button>
                        </>
                    )}
                    {showCheckButton && (
                        <button style={{ backgroundColor: 'orange', color: 'white', border: 'orange', padding: '8px 16px', borderRadius: '4px' }} onClick={() => onShowChart(row._original.id)}>Check Consumption</button>
                    )}
                </div>
            )
        }
    ];

    const filters = [{ accessor: 'description' }];

    function handleDelete(id) {
        API_DEVICES.deleteDeviceAssociations(id, () => {
            API_DEVICES.deleteDevice({ id }, () => {
                const updatedTableData = props.tableData.filter(device => device.id !== id);
                props.setTableData(updatedTableData);
            });
        });
    }

    return (
        <Table
            data={props.tableData}
            columns={columns}
            search={filters}
            pageSize={5}
            key={props.tableData.map(device => device.id).join()}
        />
    );
}

export default DeviceTable;
