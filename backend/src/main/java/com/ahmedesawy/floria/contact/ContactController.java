package com.ahmedesawy.floria.contact;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/shop/contact")
@RequiredArgsConstructor
@Validated
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<String> send(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {
        contactService.send(request, httpRequest.getRemoteAddr());
        return ResponseEntity.ok("Message sent");
    }
}
