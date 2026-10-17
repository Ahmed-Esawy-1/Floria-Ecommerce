package com.ahmedesawy.floria.auth;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final StringRedisTemplate redisTemplate;

    public void blacklist(String token, long remainingExpiryMillis) {
        if (remainingExpiryMillis <= 0)
            return;

        redisTemplate.opsForValue().set(
                tokenKey(token),
                "true",
                Duration.ofMillis(remainingExpiryMillis));
    }

    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(tokenKey(token)));
    }

    // ---- HELPERS --------------------------------------------------------
    private String tokenKey(String token) {
        return "blacklist:%s".formatted(token);
    }
}