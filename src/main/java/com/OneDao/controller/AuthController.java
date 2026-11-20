
package com.OneDao.controller;

import com.OneDao.dto.ApiResponse;
import com.OneDao.dto.AuthResponse;
import com.OneDao.dto.LoginRequest;
import com.OneDao.dto.RegisterRequest;
import com.OneDao.security.JwtService;
import com.OneDao.security.TokenBlacklistService;
import com.OneDao.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            @RequestHeader(
                    value = "X-Test-Country",
                    required = false
            ) String testCountryCode
    ) {

        String ipAddress = httpRequest.getRemoteAddr();

        AuthResponse response = authService.register(
                request,
                ipAddress,
                testCountryCode
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Registration successful",
                        response
                ));
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Login successful",
                        response
                )
        );
    }

    // User Logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorizationHeader
    ) {

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(
                            false,
                            "Invalid or missing authorization token",
                            null
                    ));
        }

        String token = authorizationHeader.substring(7);

        tokenBlacklistService.blacklistToken(
                token,
                jwtService.extractExpiration(token)
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Logout successful",
                        null
                )
        );
    }
}
