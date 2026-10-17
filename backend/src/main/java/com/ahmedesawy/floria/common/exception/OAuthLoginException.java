package com.ahmedesawy.floria.common.exception;

import lombok.Getter;

@Getter
public class OAuthLoginException extends RuntimeException {

    private final String code;

    public OAuthLoginException(String code) {
        super(code);
        this.code = code;
    }
}