package com.example.devices.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
public class Device {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name="id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "maxHourEnergyConsumption", nullable = false)
    private String maxHourEnergyConsumption;

    public Device(String description, String address, String maxHourEnergyConsumption){
        this.description = description;
        this.address = address;
        this.maxHourEnergyConsumption = maxHourEnergyConsumption;
    }

    public Device(){
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMaxHourEnergyConsumption() {
        return maxHourEnergyConsumption;
    }

    public void setMaxHourEnergyConsumption(String maxHourEnergyConspumption) {
        this.maxHourEnergyConsumption = maxHourEnergyConspumption;
    }

}
