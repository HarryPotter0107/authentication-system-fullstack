
package com.OneDao.service;

import com.OneDao.dto.AuthResponse;
import com.OneDao.dto.LoginRequest;
import com.OneDao.dto.RegisterRequest;
import com.OneDao.entity.User;
import com.OneDao.enums.Role;
import com.OneDao.exception.InvalidCredentialsException;
import com.OneDao.exception.UserAlreadyExistsException;
import com.OneDao.security.JwtService;
import com.OneDao.store.InMemoryUserStore;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final InMemoryUserStore userStore;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CountryRestrictionService countryRestrictionService;
    private final IpGeolocationService ipGeolocationService;

    // User Registration
    public AuthResponse register(
            RegisterRequest request,
            String ipAddress,
            String testCountryCode
    ) {

        // Step 1: Identify user's country
        String countryCode = ipGeolocationService.getCountryCode(
                ipAddress,
                testCountryCode
        );

        // Step 2: Check country restrictions
        if (!countryRestrictionService.isRegistrationAllowed(countryCode)) {
            throw new IllegalArgumentException(
                    "Registration is not allowed from your country"
            );
        }

        // Step 3: Check duplicate username
        if (userStore.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username already exists"
            );
        }

        // Step 4: Check duplicate email
        if (userStore.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email already exists"
            );
        }

        // Step 5: Create user
        User user = new User();

        user.setId(UUID.randomUUID());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // Encrypt password using BCrypt
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Public registration always creates Standard User
        user.setRole(Role.STANDARD_USER);

        // Save user in in-memory storage
        userStore.save(user);

        // Step 6: Generate JWT
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                user.getUsername(),
                user.getRole().name()
        );
    }

    // User Login
    public AuthResponse login(LoginRequest request) {

        User user = userStore.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid username or password"
                        )
                );

        // Verify password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new InvalidCredentialsException(
                    "Invalid username or password"
            );
        }

        // Generate JWT
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                user.getUsername(),
                user.getRole().name()
        );
    }
}
