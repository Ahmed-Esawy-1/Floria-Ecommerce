package com.ahmedesawy.floria.auth;

import java.util.UUID;

public record AccountIdentity(UUID id, String email, AccountType type) {
    public enum AccountType { CUSTOMER, EMPLOYEE }
}