package com.example.devices.repository;

import com.example.devices.entity.Device;
import com.example.devices.entity.DevicesToUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DevicesToUsersRepository extends JpaRepository<DevicesToUsers, Long> {
    @Query("SELECT dt.deviceId FROM DevicesToUsers dt WHERE dt.userId = :userId")
    public List<UUID> findDeviceIdsByUserId(@Param("userId") UUID userId);

    Optional<DevicesToUsers> findByDeviceIdAndUserId(UUID deviceId, UUID userId);

    List<DevicesToUsers> findByDeviceId(UUID deviceId);

    List<DevicesToUsers> findByUserId(UUID userId);

}
