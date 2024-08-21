package com.himedias.varletserver.security.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
public class JWTUtil {
    // 30 자리 이상의 키값 문자열(String) (JWT를 서명하는 데 사용됩니다.)
    private static String key  = "1234567890123456789012345678901234567890";
    // JWT 토큰을 생성하는 메소드
    public static String generateToken(Map<String, Object> claims, int i) {
        SecretKey key = null;
        try{
            // 문자열 키를 SecretKey 객체로 변환합니다.
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
        }catch (Exception e){
            // 키 변환 중 에러가 발생하면 RuntimeException을 던집니다.
            throw new RuntimeException(e.getMessage());
        }
        // JWT 토큰을 생성합니다.
        String jwtStr = Jwts.builder()
                .setHeader(Map.of("typ","JWT"))  // JWT 타입을 지정합니다.
                .setClaims(claims) // 클레임을 설정합니다.
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant())) // 발급 시간을 설정합니다.
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(i).toInstant()))  // 만료 시간을 설정합니다.
                .signWith(key) // 서명합니다.
                .compact(); // JWT 문자열을 생성합니다.
        return jwtStr; // 생성된 JWT 문자열을 반환합니다.
    }

    // JWT 토큰을 검증하는 메소드
    public static Map<String, Object> validateToken(String accessToken) throws CustomJWTException{
                Map<String, Object> claim = null;
                try{
                    SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8")); // 문자열 키를 SecretKey 객체로 변환합니다.
                    // JWT를 파싱하고 검증합니다.
                    claim = Jwts.parserBuilder()
                            .setSigningKey(key)
                            .build()
                            .parseClaimsJws(accessToken) // 파싱 및 검증, 실패 시 에러
                            .getBody();; // 클레임을 반환합니다.
        }catch(ExpiredJwtException expiredJwtException){
            // 토큰이 만료된 경우
            throw new CustomJWTException("Expired");
        }catch(InvalidClaimException invalidClaimException){
            // 클레임이 유효하지 않은 경우
            throw new CustomJWTException("Invalid");
        }catch(JwtException jwtException){
            // JWT 처리 중 일반적인 오류가 발생한 경우
            throw new CustomJWTException("JWTError");
        }catch(Exception e){
            // 기타 모든 예외가 발생한 경우
            throw new CustomJWTException("Error");
        }
        return claim; // 검증된 클레임을 반환합니다.
    }
}
