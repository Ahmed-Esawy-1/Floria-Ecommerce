package com.ahmedesawy.floria.auth.oauth;

import java.time.Duration;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuthExchangeService {

    private final StringRedisTemplate redisTemplate;

    private static final Duration EXCHANGE_TTL = Duration.ofSeconds(30);

    public String store(String accessToken) {
        String code = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(exchangeKey(code), accessToken, EXCHANGE_TTL);
        return code;
    }

    public String consume(String code) {
        String key = exchangeKey(code);
        String accessToken = redisTemplate.opsForValue().get(key);
        if (accessToken == null) {
            throw new BadCredentialsException("Invalid or expired exchange code");
        }
        redisTemplate.delete(key);
        return accessToken;
    }

    // ---- HELPERS ---------
    private String exchangeKey(String code) {
        return "oauth-exchange:%s".formatted(code);
    }
}
