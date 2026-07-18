package com.eventra.backend.service;

import com.eventra.backend.entity.User;
import com.eventra.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        String role = user.getRole();

        if (role == null || role.isBlank()) {
            user.setRole("CUSTOMER");
        } else {
            role = role.trim().toUpperCase();

            if (!role.equals("CUSTOMER") && !role.equals("ORGANIZER")) {
                user.setRole("CUSTOMER");
            } else {
                user.setRole(role);
            }
        }

        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Optional.empty();
        }

        return Optional.of(user);
    }
}