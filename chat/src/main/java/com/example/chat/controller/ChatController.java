package com.example.chat.controller;

import com.example.chat.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;


@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private-message") //app/private-message
    private Message receivePrivateMessage(@Payload Message message){
        message.setType("MESSAGE");
        System.out.println("Received private message: " + message);
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message); //user/David/private
        return message;
    }

    @MessageMapping("/read-message")
    public void handleRead(Message message) {
        message.setType("READ");
        simpMessagingTemplate.convertAndSendToUser(message.getSenderName(), "/private", message);
    }

    @MessageMapping("/typing")
    public void handleTyping(@Payload Message message) {
        message.setType("TYPING");
        message.setMessage(" is typing");
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
    }

    @MessageMapping("/stop-typing")
    public void handleStopTyping(@Payload Message message) {
        message.setType("STOP_TYPING");
        message.setMessage(" is not typing");
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
    }

}
