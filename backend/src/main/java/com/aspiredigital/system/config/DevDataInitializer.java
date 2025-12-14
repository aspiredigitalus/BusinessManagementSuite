package com.aspiredigital.system.config;

import com.aspiredigital.system.model.User;
import com.aspiredigital.system.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("dev")
public class DevDataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DevDataInitializer.class);

    @Value("${app.dev.user.username}")
    private String devUsername;

    @Value("${app.dev.user.password}")
    private String devPassword;

    @Value("${app.dev.user.email}")
    private String devEmail;

    @Bean
    CommandLineRunner initDevUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername(devUsername)) {
                User devUser = new User();
                devUser.setUsername(devUsername);
                devUser.setPassword(passwordEncoder.encode(devPassword));
                devUser.setEmail(devEmail);
                devUser.setFirstName("Dev");
                devUser.setLastName("User");
                devUser.setEnabled(true);

                userRepository.save(devUser);
                logger.info("Development user '{}' created successfully", devUsername);
            } else {
                logger.info("Development user '{}' already exists", devUsername);
            }
        };
    }
}
