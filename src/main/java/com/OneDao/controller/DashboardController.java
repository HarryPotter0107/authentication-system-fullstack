package com.OneDao.controller;

import com.OneDao.dto.ApiResponse;
import com.OneDao.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public ResponseEntity<ApiResponse<String>> getDashboard(
            @AuthenticationPrincipal User user
    ) {

        String message = "Welcome " + user.getUsername();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Dashboard accessed successfully",
                        message
                )
        );
    }
}