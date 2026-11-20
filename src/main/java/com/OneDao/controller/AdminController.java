package com.OneDao.controller;

import com.OneDao.dto.ApiResponse;
import com.OneDao.entity.User;
import com.OneDao.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {

        List<Map<String, Object>> users = userService.getAllUsers()
                .values()
                .stream()
                .map(this::toSafeUserResponse)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Users retrieved successfully",
                        users
                )
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserById(
            @PathVariable UUID id
    ) {

        User user = userService.getUserById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User retrieved successfully",
                        toSafeUserResponse(user)
                )
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable UUID id
    ) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User deleted successfully",
                        null
                )
        );
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {

        Map<String, String> settings = Map.of(
                "application", "Authentication System",
                "authentication", "JWT",
                "access", "Administrator"
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Administrator settings retrieved successfully",
                        settings
                )
        );
    }

    private Map<String, Object> toSafeUserResponse(User user) {

        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }
}