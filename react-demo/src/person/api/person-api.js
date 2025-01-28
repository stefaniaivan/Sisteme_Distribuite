import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    person: '/person'
};

function deletePerson(params, callback){
    let request = new Request(HOST.backend_api + endpoint.person + '/' + params.id, {
        method: 'DELETE',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function updatePerson(personId, personData, callback){
    let request = new Request(HOST.backend_api + endpoint.person + '/' + personId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData)
    });
    console.log("Update URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function getPersons(callback) {
    let request = new Request(HOST.backend_api + endpoint.person, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPersonById(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.person + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPerson(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.person, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getPersons,
    getPersonById,
    postPerson,
    deletePerson,
    updatePerson
};
