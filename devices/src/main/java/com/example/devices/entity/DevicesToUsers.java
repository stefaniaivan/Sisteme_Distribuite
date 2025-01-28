package com.example.devices.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class DevicesToUsers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private Long id;

    @Column(name = "deviceId", nullable = false)
    private UUID deviceId;

    @Column(name = "userId", nullable = false)
    private UUID userId;

    public DevicesToUsers() {}

    public DevicesToUsers(UUID deviceId, UUID userId){
        this.deviceId = deviceId;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

}
