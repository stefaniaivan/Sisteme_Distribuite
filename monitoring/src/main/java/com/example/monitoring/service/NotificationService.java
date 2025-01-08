package com.example.monitoring.service;

import com.example.monitoring.entity.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(UUID deviceId, String message){
        messagingTemplate.convertAndSend("/topic/alerts", new NotificationMessage(deviceId, message));
    }
}
