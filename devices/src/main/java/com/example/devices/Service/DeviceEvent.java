package com.example.devices.Service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DeviceEvent {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void deviceDeleteEvent(String deviceId){
        Map<String, Object> message = new HashMap<>();
        message.put("action", "delete");
        message.put("deviceId", deviceId);

        rabbitTemplate.convertAndSend("device_delete", message);
        System.out.println("Device delete event published: " + message);
    }
}
