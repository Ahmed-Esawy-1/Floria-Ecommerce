package com.ahmedesawy.flow;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class Test {

    private static final String CHARACTERS =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final SecureRandom secureRandom = new SecureRandom();
    

    public String generateCode(int length) {
        StringBuilder code = new StringBuilder(length);
        for(int i = 0; i < length; i++ ) {
            int index = secureRandom.nextInt(CHARACTERS.length());
            System.out.println("Index => " + index);
            code.append(CHARACTERS.charAt(index));
            System.out.println(CHARACTERS.charAt(index));
            System.out.println("-----------------------------");

        }
        return code.toString();
    }


}
