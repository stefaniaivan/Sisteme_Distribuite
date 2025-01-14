package com.example.simulator2.producer;

import com.example.simulator2.entity.Measurement;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Component
public class RabbitMQProducer {

    @Autowired
    private AmqpTemplate amqpTemplate;

    private static final String CSV_FILE = "sensor.csv";

    private static final String PROPERTIES_FILE = "simulator2.properties";

    private String deviceId;

    public void readData(){
        try {
            Properties properties = new Properties();
            try (InputStream input = getClass().getClassLoader().getResourceAsStream(PROPERTIES_FILE)) {
                if (input == null) {
                    System.out.println("Unable to find " + PROPERTIES_FILE);
                    return;
                }
                properties.load(input);
                deviceId = properties.getProperty("simulator2.deviceId");
                if (deviceId == null || deviceId.isEmpty()) {
                    System.out.println("Device ID not defined!");
                    return;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
        try (BufferedReader csvReader = new BufferedReader(new FileReader(CSV_FILE))) {
            String line;
            while ((line = csvReader.readLine()) != null) {
                double measurementValue = Double.parseDouble(line.trim());
                long timestamp = System.currentTimeMillis();

                Measurement measurement = new Measurement(timestamp, deviceId, measurementValue);
                sendMeasurement(measurement);

                Thread.sleep(6000);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void sendMeasurement(Measurement measurement) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String message = objectMapper.writeValueAsString(measurement);
            String routingKey = "device." + deviceId;
            amqpTemplate.convertAndSend("meter_reading_exchange",routingKey, message);
            System.out.println("Message sent: " + message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
