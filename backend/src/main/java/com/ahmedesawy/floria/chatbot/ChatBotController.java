package com.ahmedesawy.floria.chatbot;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController 
@RequestMapping("/chat")
@RequiredArgsConstructor 
public class ChatBotController {
    
    private final ChatBotService chatBotService;

    @GetMapping("/ask")
    public ResponseEntity<String> askBot(@RequestParam String message) {
        return ResponseEntity.ok(chatBotService.getBotResponse(message));
    }
    
}
