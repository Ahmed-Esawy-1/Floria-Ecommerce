package com.ahmedesawy.floria.auth;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service 
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final long DEFAULT_EXPIRATION_MILLIS = 1000L * 60 * 60 * 24; // 24 hours

    public String generateToken(String username) {
        return this.generateToken(username, new HashMap<>());
    }
    
    public String generateToken(String username, Map<String, Object> extraClaims) {
        return generateToken(username, extraClaims, DEFAULT_EXPIRATION_MILLIS);
    }
    
    public String generateToken(String username, Map<String, Object> extraClaims, long expirationMillis) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(getSignInKey())
                .compact();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ---- CLAIMS ---------------------------------------------------------------------------

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    


    // ---- Token Vaild ---------------------------------------------------
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        
        boolean usernameMatch = Objects.equals(username, userDetails.getUsername());
        boolean tokenIsExpired = extractExpiration(token).before(new Date(System.currentTimeMillis()));
    
        return usernameMatch && !tokenIsExpired;
    }

    public long getRemainingExpiryMillis(String token) {
        Date expiration = extractExpiration(token);
        return expiration.getTime() - System.currentTimeMillis();
    }



}
