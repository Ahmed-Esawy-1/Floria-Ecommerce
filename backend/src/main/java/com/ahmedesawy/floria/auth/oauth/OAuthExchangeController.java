package com.ahmedesawy.floria.auth.oauth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth/oauth")
@RequiredArgsConstructor
public class OAuthExchangeController {

    private final OAuthExchangeService oAuthExchangeService;

    @PostMapping("/exchange")
    public ExchangeResponse exchange(@RequestBody ExchangeRequest request) {
        String accessToken = oAuthExchangeService.consume(request.code());

        return new ExchangeResponse(accessToken);
    }

    public record ExchangeRequest(String code) {
    }

    public record ExchangeResponse(String accessToken) {
    }
}
