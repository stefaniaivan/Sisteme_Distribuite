package com.example.devices.controller;

import com.example.devices.Service.DevicesToUsersService;
import com.example.devices.entity.Device;
import com.example.devices.entity.DevicesToUsers;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.client.RestTemplate;


import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/devices-to-users")
public class DevicesToUsersController {
    private final DevicesToUsersService devicesToUsersService;

    @Autowired
    public DevicesToUsersController(DevicesToUsersService devicesToUsersService){
        this.devicesToUsersService = devicesToUsersService;
    }


    @PostMapping
    public ResponseEntity<DevicesToUsers> create(@RequestParam UUID deviceId, @RequestParam UUID userId) {
        DevicesToUsers mapping = devicesToUsersService.createMapping(deviceId, userId);
        return ResponseEntity.ok(mapping);
    }

    @GetMapping("/devices-by-email")
    public List<UUID> getDevicesByEmail(@RequestParam String email) {
        UUID userId = devicesToUsersService.getUserIdByEmail(email);
        List<UUID> devices = devicesToUsersService.getDevicesByUserId(userId);
        return devices;
    }

    @GetMapping("/devices-by-userid")
    public List<UUID> getDevicesByUserId(@RequestParam UUID userId) {
        List<UUID> devices = devicesToUsersService.getDevicesByUserId(userId);
        return devices;
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam UUID deviceId, @RequestParam UUID userId) {
        boolean isDeleted = devicesToUsersService.deleteMapping(deviceId, userId);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/by-device/{deviceId}")
    public ResponseEntity<Void> deleteMappingsByDevice(@PathVariable UUID deviceId) {
        devicesToUsersService.deleteMappingsByDeviceId(deviceId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/by-user/{userId}")
    public ResponseEntity<Void> deleteMappingsByUser(@PathVariable UUID userId) {
        devicesToUsersService.deleteMappingsByUserId(userId);
        return ResponseEntity.noContent().build();
    }



}
