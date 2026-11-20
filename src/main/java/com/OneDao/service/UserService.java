package com.OneDao.service;

import com.OneDao.entity.User;
import com.OneDao.exception.ResourceNotFoundException;
import com.OneDao.store.InMemoryUserStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final InMemoryUserStore userStore;

    public User getUserById(UUID id) {
        return userStore.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + id
                        )
                );
    }

    public User getUserByUsername(String username) {
        return userStore.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + username
                        )
                );
    }

    public Map<UUID, User> getAllUsers() {
        return userStore.findAll();
    }

    public void deleteUser(UUID id) {
        boolean deleted = userStore.deleteById(id);

        if (!deleted) {
            throw new ResourceNotFoundException(
                    "User not found with ID: " + id
            );
        }
    }
}