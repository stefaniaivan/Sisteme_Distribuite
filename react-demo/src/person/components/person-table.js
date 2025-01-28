import React from "react";

import Table from "../../commons/tables/table";
import * as API_USERS from "../api/person-api";

function PersonTable(props) {
const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Age',
        accessor: 'age',
    },
    {
        Header: 'Operatiuni',
        accessor: 'actions',
        Cell: ({ row }) => {
            return (
                <div>
                    <button style={{ backgroundColor: 'red', color: 'white', border: 'red', padding: '8px 16px', borderRadius: '4px' }} onClick={() => handleDelete(row._original.id)}>Șterge</button>
                    <button style={{ backgroundColor: 'forestgreen', color: 'white', border: 'green', padding: '8px 16px', borderRadius: '4px' }} onClick={() => props.toggleForm(row._original)}>Actualizează</button>
                </div>
            );
        }
    }

];

const filters = [
    {
        accessor: 'name',
    }
];

function handleUpdate(person) {
    // Pasăm datele persoanei către componenta părinte pentru a deschide formularul de actualizare
    props.toggleForm(person);
}


function handleDelete(id) {
    API_USERS.deletePerson({ id: id }, () => {
        console.log(`Persoana cu ID-ul ${id} a fost ștearsă.`);
        const updatedTableData = props.tableData.filter(person => person.id !== id);
        console.log("Datele actualizate ale tabelului:", updatedTableData);
        props.setTableData(updatedTableData);
    });
}

    return (
        <Table
            data={props.tableData}
            columns={columns}
            search={filters}
            pageSize={5}
            key={props.tableData.map(person => person.id).join()}
        />
    );
}



export default PersonTable;