package com.example.monitoring.entity;

import java.util.UUID;

public class NotificationMessage {
    private UUID deviceId;
    private String message;

    public NotificationMessage(UUID deviceId, String message){
        this.deviceId = deviceId;
        this.message = message;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
