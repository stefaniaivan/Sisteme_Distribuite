package com.example.monitoring.controller;

import com.example.monitoring.entity.Monitoring;
import com.example.monitoring.service.MonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping()
@CrossOrigin(origins = "http://localhost:3000")
public class MonitoringController {

    @Autowired
    private MonitoringService monitoringService;

    @GetMapping("/getConsumption")
    public List<Monitoring> getDailyConsumption(
            @RequestParam String deviceId,
            @RequestParam LocalDate date) {
        return monitoringService.getDailyConsumption(deviceId, date);
    }
}
