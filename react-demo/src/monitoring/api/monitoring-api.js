import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

function getMonitoring(deviceId, selectedDate, callback) {
    let request = new Request(HOST.backend_api_3 + "/getConsumption?deviceId=" + deviceId + "&date=" + selectedDate, {
        method: 'GET',
        
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export{
    getMonitoring
}