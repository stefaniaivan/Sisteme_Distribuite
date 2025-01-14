package com.example.monitoring.consumer;

import com.example.monitoring.DeviceManagement;
import com.example.monitoring.entity.Measurement;
import com.example.monitoring.entity.Monitoring;
import com.example.monitoring.repository.MonitoringRepository;
import com.example.monitoring.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Component
public class RabbitMQConsumer {

    private Map<String, List<Double>> deviceMeasurements = new HashMap<>();
    private Map<String, Long> lastUpdateTime = new HashMap<>();

    @Autowired
    private MonitoringRepository monitoringRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private DeviceManagement deviceManagement;

    @RabbitListener(queues="meter_reading_queue")
    public void listen(String message){
        System.out.println("Received message: " + message);
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            Measurement measurement = objectMapper.readValue(message, Measurement.class);
            String deviceId = measurement.getDeviceId();
            double measurementValue = measurement.getMeasurementValue();

            List<Double> measurements = deviceMeasurements.getOrDefault(deviceId, new ArrayList<>());
            measurements.add(measurementValue); //se adauga in lista de masuratori pt. device-ul actual

            if(measurements.size() == 6){
                double hourlyConsumption = measurements.get(5) - measurements.get(0);
                System.out.println("Hourly energy consumption computed for device " + deviceId + ": " + hourlyConsumption);

                Monitoring monitoring = new Monitoring();
                monitoring.setDeviceId(deviceId);
                monitoring.setConsumption(hourlyConsumption);
                monitoring.setDate(LocalDate.now());
                monitoring.setHour(LocalTime.now().getHour());
                monitoringRepository.save(monitoring);
                if(hourlyConsumption > deviceManagement.getMaxEnergy(deviceId)){
                    String notificationMessage = "Device " + deviceId + " exceeded the limit with consumption: " + hourlyConsumption;
                    notificationService.sendNotification(UUID.fromString(deviceId), notificationMessage);
                }

                deviceMeasurements.put(deviceId, new ArrayList<>());
            }
            else{
                deviceMeasurements.put(deviceId, measurements);
            }

        } catch(IOException e){
            e.printStackTrace();
        }
    }

    @RabbitListener(queues = "device_delete")
    public void handleDeviceDelete(String message) {
        System.out.println("Received device delete event: " + message);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> deleteEvent = objectMapper.readValue(message, Map.class);
            String deviceId = deleteEvent.get("deviceId");

            monitoringRepository.deleteById(Long.valueOf(deviceId));
            System.out.println("Monitoring data deleted for device: " + deviceId);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
