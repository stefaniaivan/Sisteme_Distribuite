package com.example.devices.Service;

import com.example.devices.controller.handlers.model.ResourceNotFoundException;
import com.example.devices.entity.Device;
import com.example.devices.repository.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository){
        this.deviceRepository = deviceRepository;
    }

    public UUID insert(Device device){
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was inserted in db", device.getId());
        return device.getId();
    }

    public List<Device> findDevices(){
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList;
    }

    public Device findDeviceById(UUID id){
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if(!prosumerOptional.isPresent()){
            LOGGER.error("Device with id {} was not found in db");
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return prosumerOptional.get();
    }

    public Device updateDevice(UUID id, Device updatedDevice){
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        Device existingDevice = prosumerOptional.get();
        if(updatedDevice.getDescription() != null){
            existingDevice.setDescription(updatedDevice.getDescription());
        }
        if(updatedDevice.getAddress() != null){
            existingDevice.setAddress(updatedDevice.getAddress());
        }
        if(updatedDevice.getMaxHourEnergyConsumption() != null){
            existingDevice.setMaxHourEnergyConsumption(updatedDevice.getMaxHourEnergyConsumption());
        }

        deviceRepository.save(existingDevice);
        LOGGER.info("Device with id {} was successfully updated.", id);

        return existingDevice;
    }

    public void delete(UUID id){
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        deviceRepository.deleteById(id);
        LOGGER.info("Device with id {} was successfully deleted.", id);
    }

    public String getMaxEnergyByDeviceId(UUID id){
        Optional<Device> device = deviceRepository.findById(id);
        if(!device.isPresent()){
            LOGGER.error("Device with id {} was not found in db");
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return device.get().getMaxHourEnergyConsumption();
    }

}
