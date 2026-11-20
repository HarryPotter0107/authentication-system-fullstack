
package com.OneDao.config;

import com.OneDao.entity.User;
import com.OneDao.enums.Role;
import com.OneDao.store.InMemoryUserStore;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class AdminBootstrapConfig {

    private final InMemoryUserStore userStore;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner createInitialAdmin() {
        return args -> {

            if (userStore.existsByUsername(adminUsername)) {
                return;
            }

            User admin = new User();

            admin.setId(UUID.randomUUID());
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );
            admin.setRole(Role.ADMINISTRATOR);

            userStore.save(admin);

            System.out.println("Initial Administrator created successfully.");
        };
    }
}
