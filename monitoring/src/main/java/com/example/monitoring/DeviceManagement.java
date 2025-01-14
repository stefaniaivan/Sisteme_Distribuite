package com.example.monitoring;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DeviceManagement {

    @Autowired
    private RestTemplate restTemplate;

    private final HttpServletRequest request;

    public DeviceManagement(HttpServletRequest request) {
        this.request = request;
    }

    public Double getMaxEnergy(String deviceId) {
        /*String url = "http://localhost:8081/devices/device/" + deviceId + "/max-energy";*/
        String url = "http://devices:8081/devices/device/" + deviceId + "/max-energy";
        /*HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header is missing or invalid");
        }
        String token = authorizationHeader.substring(7);
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);*/
        try {
            ResponseEntity<Double> response = restTemplate.getForEntity(url, Double.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error fetching max energy for device " + deviceId + ": " + e.getMessage());
            return null;
        }
    }

}
