package com.ahmedesawy.floria.common.util;

import java.security.SecureRandom;

public final class CodeGenerator {

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private CodeGenerator() {}

    public static String generate(int length) {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = SECURE_RANDOM.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }
        return code.toString();
    }
}