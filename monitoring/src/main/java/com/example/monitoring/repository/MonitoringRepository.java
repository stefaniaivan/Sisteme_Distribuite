package com.example.monitoring.repository;

import com.example.monitoring.entity.Monitoring;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MonitoringRepository extends JpaRepository<Monitoring,Long> {

    public List<Monitoring> findByDeviceIdAndDate(String deviceId, LocalDate date);
}
