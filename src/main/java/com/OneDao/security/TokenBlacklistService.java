package com.OneDao.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class TokenBlacklistService {

    private final ConcurrentMap<String, Instant> blacklistedTokens =
            new ConcurrentHashMap<>();

    public void blacklistToken(String token, Date expiration) {
        blacklistedTokens.put(
                token,
                expiration.toInstant()
        );
    }

    public boolean isTokenBlacklisted(String token) {

        Instant expiration = blacklistedTokens.get(token);

        if (expiration == null) {
            return false;
        }

        if (expiration.isBefore(Instant.now())) {
            blacklistedTokens.remove(token, expiration);
            return false;
        }

        return true;
    }
}