package com.example.monitoring.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue meterReadingQueue(){
        return new Queue("meter_reading_queue", true);
    }

    @Bean
    public TopicExchange exchange(){
        return new TopicExchange("meter_reading_exchange");
    }

    @Bean
    public Binding binding(Queue meterReadingQueue, TopicExchange exchange){
        return BindingBuilder.bind(meterReadingQueue).to(exchange).with("routing.key");
    }

    @Bean
    public Queue deviceDeleteQueue() {
        return new Queue("device_delete", true);
    }

    @Bean
    public TopicExchange deviceDeleteExchange() {
        return new TopicExchange("device_delete_exchange");
    }

    @Bean
    public Binding deviceDeleteBinding(Queue deviceDeleteQueue, TopicExchange deviceDeleteExchange) {
        return BindingBuilder.bind(deviceDeleteQueue).to(deviceDeleteExchange).with("device.delete");
    }
}
