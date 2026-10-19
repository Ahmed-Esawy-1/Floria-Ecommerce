package com.ahmedesawy.floria.common.mail;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class BrevoMailService {

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient;
    private final String senderEmail;
    private final String senderName;

    public BrevoMailService(
            @Value("${brevo.api-key}") String apiKey,
            @Value("${brevo.sender-email}") String senderEmail,
            @Value("${brevo.sender-name:Floria}") String senderName) {
        this.restClient = RestClient.builder()
                .baseUrl(BREVO_URL)
                .defaultHeader("api-key", apiKey)
                .defaultHeader("accept", "application/json")
                .defaultHeader("content-type", "application/json")
                .build();
        this.senderEmail = senderEmail;
        this.senderName = senderName;
    }

    public void send(String toEmail, String subject, String textContent) {
        send(toEmail, subject, textContent, null);
    }

    public void send(String toEmail, String subject, String textContent, String replyToEmail) {
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("email", senderEmail, "name", senderName));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("subject", subject);
        body.put("textContent", textContent);

        if (replyToEmail != null && !replyToEmail.isBlank()) {
            body.put("replyTo", Map.of("email", replyToEmail));
        }

        restClient.post()
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}