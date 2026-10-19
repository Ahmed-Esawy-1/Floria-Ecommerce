package com.ahmedesawy.floria.contact;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import com.ahmedesawy.floria.common.mail.BrevoMailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private static final Duration COOLDOWN = Duration.ofSeconds(60);

    private static final Map<String, String> SUBJECT_LABELS = Map.of(
            "general", "General Inquiry",
            "bespoke", "Bespoke Arrangement",
            "events", "Wedding & Events",
            "corporate", "Corporate Partnership",
            "press", "Press & Media");

    private final BrevoMailService mailService;
    private final StringRedisTemplate redisTemplate;

    @Value("${contact.recipient}")
    private String recipient;

    public void send(ContactRequest request, String ip) {
        String rateKey = "contact-rate:" + ip;
        enforceCooldown(rateKey);

        String subject = clean("[Floria Contact] " + SUBJECT_LABELS.get(request.getSubject()));

        try {
            mailService.send(
                    recipient,
                    subject,
                    buildBody(request),
                    clean(request.getEmail()));
        } catch (RestClientException ex) {
            redisTemplate.delete(rateKey);
            log.error("Failed to send contact email", ex);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not send your message. Please try again later.");
        }
    }

    // ---- HELPERS ----------------------
    private void enforceCooldown(String rateKey) {
        Boolean allowed = redisTemplate.opsForValue().setIfAbsent(rateKey, "1", COOLDOWN);
        if (!Boolean.TRUE.equals(allowed)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait a moment before sending another message.");
        }
    }

    // Plain text only
    private String buildBody(ContactRequest request) {
        return """
                New message from the Floria website

                Name: %s
                Email: %s
                Subject: %s

                Message:
                %s
                """.formatted(
                clean(request.getName()),
                clean(request.getEmail()),
                SUBJECT_LABELS.get(request.getSubject()),
                request.getMessage());
    }

    // Removes line breaks
    private String clean(String value) {
        return value == null ? "" : value.replaceAll("[\\r\\n]+", " ").trim();
    }
}