package com.example.monitoring.producer;

import com.example.monitoring.entity.Measurement;
import com.example.monitoring.repository.MonitoringRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStream;
import java.util.Properties;

@Component
public class RabbitMQProducer implements CommandLineRunner {
    private static final String CSV_FILE = "sensor.csv";
    private static final String PROPERTIES_FILE = "simulator.properties";

    private String deviceId;

    @Autowired
    private AmqpTemplate amqpTemplate;


    @Override
    public void run(String... args){
        try {
            Properties properties = new Properties();
            try (InputStream input = getClass().getClassLoader().getResourceAsStream(PROPERTIES_FILE)) {
                if (input == null) {
                    System.out.println("Unable to find " + PROPERTIES_FILE);
                    return;
                }
                properties.load(input);
                deviceId = properties.getProperty("simulator.deviceId");
                if (deviceId == null || deviceId.isEmpty()) {
                    System.out.println("Device ID not defined!");
                    return;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        try(BufferedReader csvReader = new BufferedReader(new FileReader(CSV_FILE))){
            String line;
            while((line = csvReader.readLine()) != null){
                double measurementValue = Double.parseDouble(line.trim());
                long timestamp = System.currentTimeMillis();

                Measurement measurement = new Measurement(timestamp, deviceId, measurementValue);
                ObjectMapper objectMapper = new ObjectMapper();
                String message = objectMapper.writeValueAsString(measurement);

                amqpTemplate.convertAndSend("meter_reading_queue", message);
                System.out.println("Message sent: " + message);

                Thread.sleep(6000);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
