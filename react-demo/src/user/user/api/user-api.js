import { HOST } from '../../../commons/hosts';
import RestApiClient from "../../../commons/api/rest-client";

const endpoint = {
    user: '/user'
};

function getUsers(callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getAdmins(callback){
    let request = new Request(HOST.backend_api + endpoint.user + '/admins', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request,callback);
}

function getUserByEmail(email, callback){
    const token = sessionStorage.getItem('token');
    let request = new Request(HOST.backend_api + endpoint.user + '/getUserByEmail?email=' + email, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
    });
    RestApiClient.performRequest(request, callback);
}

function deleteUser(params, callback){
    let request = new Request(HOST.backend_api + endpoint.user + '/' + params.id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function updateUser(userId, userData, callback){
    let request = new Request(HOST.backend_api + endpoint.user + '/' + userId, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    console.log("Update URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function loginUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.user + '/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("Login URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function postUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export{
    getUsers,
    postUser,
    deleteUser,
    updateUser,
    loginUser,
    getAdmins,
    getUserByEmail
};