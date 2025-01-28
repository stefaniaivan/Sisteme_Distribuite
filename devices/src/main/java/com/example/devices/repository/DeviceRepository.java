package com.example.devices.repository;

import com.example.devices.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    @Query("SELECT d.maxHourEnergyConsumption FROM Device d WHERE d.id = :deviceId")
    Double findMaxEnergyByDeviceId(@Param("deviceId") String deviceId);
}
