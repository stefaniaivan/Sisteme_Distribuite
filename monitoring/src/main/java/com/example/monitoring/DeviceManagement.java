package com.example.monitoring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DeviceManagement {

    @Autowired
    private RestTemplate restTemplate;

    public Double getMaxEnergy(String deviceId) {
        String url = "http://localhost:8081/devices/" + deviceId + "/max-energy";
        try {
            return restTemplate.getForObject(url, Double.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
