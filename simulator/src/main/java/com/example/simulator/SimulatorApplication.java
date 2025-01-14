package com.example.simulator;

import com.example.simulator.producer.RabbitMQProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class SimulatorApplication implements CommandLineRunner {

	@Autowired
	private RabbitMQProducer rabbitMQProducer;

	public static void main(String[] args) {
		SpringApplication.run(SimulatorApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		rabbitMQProducer.readData();
	}
}
