package com.sistemacontable.sistema_contable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.modelmapper.ModelMapper;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.PasswordEncoder;

@SpringBootApplication
public class SistemaContableApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaContableApplication.class, args);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new PasswordEncoder();
	}

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

}
