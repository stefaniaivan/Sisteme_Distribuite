import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    device: '/device',
    devices: '/devices-to-users'
};

function deleteDevice(params, callback){
    let request = new Request(HOST.backend_api_2 + endpoint.device + '/' + params.id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteDeviceAssociations(params, callback){
    let request = new Request(HOST.backend_api_2 + endpoint.devices + '/by-device/' + params.id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function addDeviceToUser(userId, deviceId, callback){
    let request = new Request(HOST.backend_api_2 + endpoint.devices + '?userId=' + userId + '&deviceId=' + deviceId, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId }),
    });

    console.log(request.url); 
    RestApiClient.performRequest(request, callback);
};

function updateDevice(deviceId, deviceData, callback){
    let request = new Request(HOST.backend_api_2 + endpoint.device + '/' + deviceId, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData)
    });
    console.log("Update URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function getDevices(callback) {
    let request = new Request(HOST.backend_api_2 + endpoint.device, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback) {
    let request = new Request(HOST.backend_api_2 + endpoint.device + '/' + params.id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback) {
    let request = new Request(HOST.backend_api_2 + endpoint.device, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function getDevicesByEmail(email, token, callback) {
    let request = new Request(HOST.backend_api_2 + endpoint.devices + '/devices-by-email?email=' + email, 
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    console.log(request.url); 
    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    deleteDevice,
    updateDevice,
    addDeviceToUser,
    getDevicesByEmail,
    deleteDeviceAssociations
};
