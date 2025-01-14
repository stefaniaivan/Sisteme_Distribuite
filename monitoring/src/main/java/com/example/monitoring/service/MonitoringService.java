package com.example.monitoring.service;

import com.example.monitoring.entity.Monitoring;
import com.example.monitoring.repository.MonitoringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MonitoringService {

    private final MonitoringRepository monitoringRepository;

    @Autowired
    public MonitoringService(MonitoringRepository monitoringRepository) {
        this.monitoringRepository = monitoringRepository;
    }

    public List<Monitoring> getDailyConsumption(String deviceId, LocalDate date){
        return monitoringRepository.findByDeviceIdAndDate(deviceId,date);
    }
}
