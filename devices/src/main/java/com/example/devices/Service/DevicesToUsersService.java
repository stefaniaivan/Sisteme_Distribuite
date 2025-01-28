package com.example.devices.Service;

import com.example.devices.entity.DevicesToUsers;
import com.example.devices.repository.DevicesToUsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DevicesToUsersService {

    @Autowired
    private RestTemplate restTemplate;

    private final HttpServletRequest request;

    private final DevicesToUsersRepository devicesToUsersRepository;

    @Autowired
    public DevicesToUsersService(HttpServletRequest request, DevicesToUsersRepository devicesToUsersRepository){
        this.request = request;
        this.devicesToUsersRepository = devicesToUsersRepository;
    }

    public DevicesToUsers createMapping(UUID deviceId, UUID userId) {
        DevicesToUsers mapping = new DevicesToUsers(deviceId, userId);
        return devicesToUsersRepository.save(mapping);
    }

    public boolean deleteMapping(UUID deviceId, UUID userId) {
        Optional<DevicesToUsers> mapping = devicesToUsersRepository.findByDeviceIdAndUserId(deviceId, userId);
        if (mapping.isPresent()) {
            devicesToUsersRepository.delete(mapping.get());
            return true;
        }
        return false;
    }

    public void deleteMappingsByDeviceId(UUID deviceId) {
        List<DevicesToUsers> mappings = devicesToUsersRepository.findByDeviceId(deviceId);
        devicesToUsersRepository.deleteAll(mappings);
    }

    public void deleteMappingsByUserId(UUID userId) {
        List<DevicesToUsers> mappings = devicesToUsersRepository.findByUserId(userId);
        devicesToUsersRepository.deleteAll(mappings);
    }

    public List<UUID> getDevicesByUserId(UUID userId) {
        return devicesToUsersRepository.findDeviceIdsByUserId(userId);
    }

    /*public UUID getUserIdByEmail(String email) {
        String url = "http://localhost:8080/spring-demo/user/getUserId?email=" + email;
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header is missing or invalid");
        }
        String token = authorizationHeader.substring(7);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<UUID> response = restTemplate.exchange(url, HttpMethod.GET, entity, UUID.class);
        return response.getBody();
    }*/

    public UUID getUserIdByEmail(String email) {
        String url = "http://spring-demo:8080/spring-demo/user/getUserId?email=" + email;

        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header is missing or invalid");
        }
        String token = authorizationHeader.substring(7);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<UUID> response = restTemplate.exchange(url, HttpMethod.GET, entity, UUID.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to get user ID: " + e.getMessage(), e);
        }
    }

}
