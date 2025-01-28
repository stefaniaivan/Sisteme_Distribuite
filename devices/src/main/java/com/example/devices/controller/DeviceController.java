package com.example.devices.controller;

import com.example.devices.Service.DeviceEvent;
import com.example.devices.Service.DeviceService;
import com.example.devices.entity.Device;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {
    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService){
        this.deviceService = deviceService;
    }

    @Autowired
    private DeviceEvent deviceEvent;

    @GetMapping("/{id}/max-energy")
    public ResponseEntity<String> getMaxEnergy(@PathVariable UUID id){
        String maxEnergy = deviceService.getMaxEnergyByDeviceId(id);
        return new ResponseEntity<>(maxEnergy,HttpStatus.OK);
    }
    @GetMapping()
    public ResponseEntity<List<Device>> getDevices() {
        List<Device> devices = deviceService.findDevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Device> getDevice(@PathVariable("id") UUID deviceId) {
        Device device = deviceService.findDeviceById(deviceId);
        return new ResponseEntity<>(device, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable UUID id, @RequestBody Device updatedDevice) {
        Device newDevice = deviceService.updateDevice(id, updatedDevice);
        return ResponseEntity.ok(newDevice);
    }

    @PostMapping()
    public ResponseEntity<UUID> insertDevice(@Valid @RequestBody Device device) {
        UUID deviceID = deviceService.insert(device);
        return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        deviceService.delete(id);
        deviceEvent.deviceDeleteEvent(String.valueOf(id));
        return ResponseEntity.noContent().build();
    }


}
