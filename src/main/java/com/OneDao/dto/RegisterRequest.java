package com.OneDao.dto;

import com.OneDao.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 8, max = 50,
            message = "Username must be between 8 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Pattern(
            regexp = "^(?=.*@)(?=.*_).+$",
            message = "Email must contain both @ and _"
    )
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 12,
            message = "Password must be between 8 and 12 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,12}$",
            message = "Password must contain uppercase, lowercase, digit and special character"
    )
    private String password;

    @NotNull(message = "User role is required")
    private Role role;
}