package com.OneDao.store;

import com.OneDao.entity.User;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryUserStore {

    // Store users using UUID as the key
    private final Map<UUID, User> usersById = new ConcurrentHashMap<>();

    // Store username-to-ID mapping for quick username lookup
    private final Map<String, UUID> usernameIndex = new ConcurrentHashMap<>();

    // Store email-to-ID mapping for quick email lookup
    private final Map<String, UUID> emailIndex = new ConcurrentHashMap<>();

    // Save a new user
    public User save(User user) {

        if (user.getId() == null) {
            user.setId(UUID.randomUUID());
        }

        usersById.put(user.getId(), user);
        usernameIndex.put(user.getUsername().toLowerCase(), user.getId());
        emailIndex.put(user.getEmail().toLowerCase(), user.getId());

        return user;
    }

    // Find user by ID
    public Optional<User> findById(UUID id) {
        return Optional.ofNullable(usersById.get(id));
    }

    // Find user by username
    public Optional<User> findByUsername(String username) {

        UUID userId = usernameIndex.get(username.toLowerCase());

        return Optional.ofNullable(userId)
                .map(usersById::get);
    }

    // Find user by email
    public Optional<User> findByEmail(String email) {

        UUID userId = emailIndex.get(email.toLowerCase());

        return Optional.ofNullable(userId)
                .map(usersById::get);
    }

    // Check whether username already exists
    public boolean existsByUsername(String username) {
        return usernameIndex.containsKey(username.toLowerCase());
    }

    // Check whether email already exists
    public boolean existsByEmail(String email) {
        return emailIndex.containsKey(email.toLowerCase());
    }

    // Return all registered users
    public Map<UUID, User> findAll() {
        return Map.copyOf(usersById);
    }

    // Delete user by ID
    public boolean deleteById(UUID id) {

        User user = usersById.remove(id);

        if (user == null) {
            return false;
        }

        usernameIndex.remove(user.getUsername().toLowerCase(), id);
        emailIndex.remove(user.getEmail().toLowerCase(), id);

        return true;
    }

    // Return total registered users
    public int count() {
        return usersById.size();
    }
}
