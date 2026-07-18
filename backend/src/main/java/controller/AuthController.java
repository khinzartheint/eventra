package com.eventra.backend.controller;

import com.eventra.backend.dto.LoginRequest;
import com.eventra.backend.dto.RegisterRequest;
import com.eventra.backend.entity.User;
import com.eventra.backend.repository.UserRepository;
import com.eventra.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(
            UserService userService,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Email is already registered"
                    ));
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        User savedUser = userService.register(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Registration successful",
                        "userId", savedUser.getId(),
                        "fullName", savedUser.getFullName(),
                        "email", savedUser.getEmail(),
                        "role", savedUser.getRole()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {
        Optional<User> userOptional = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        User user = userOptional.get();

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "userId", user.getId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
    }
}