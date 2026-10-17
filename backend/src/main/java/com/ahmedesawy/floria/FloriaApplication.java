package com.ahmedesawy.floria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class FloriaApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory(System.getProperty("user.dir"))
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		SpringApplication.run(FloriaApplication.class, args);
	}

}
