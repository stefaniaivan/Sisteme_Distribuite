package com.example.monitoring.repository;

import com.example.monitoring.entity.Monitoring;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonitoringRepository extends JpaRepository<Monitoring,Long> {
}
