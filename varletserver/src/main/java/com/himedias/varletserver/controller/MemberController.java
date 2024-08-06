package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.security.util.CustomJWTException;
import com.himedias.varletserver.security.util.JWTUtil;
import com.himedias.varletserver.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;




    @GetMapping("/refresh/{refreshToken}")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader,
                                       @PathVariable("refreshToken") String refreshToken
    ) throws CustomJWTException {
        if(refreshToken == null ) throw new CustomJWTException("NULL_REFRASH");
        if(authHeader == null || authHeader.length() < 7 )
            throw new CustomJWTException("INVALID_HEADER");

        // 추출하는 내용의 7번째 글자부터 끝까지 추출합니다
        String accessToken = authHeader.substring(7);

        if(checkExpiredToken(accessToken)){ // 기간이 지나면 true, 안지났으면 false 리턴
            return Map.of("access_token",accessToken,"refresh_token",refreshToken);
        }
        // accessToken 기간 만료시 refresh 토큰으로 재 검증하여 사용자 정보 추출
        Map<String,Object> claims = JWTUtil.validateToken(refreshToken);

        // 토큰 교체
        String newAccessToken = JWTUtil.generateToken(claims,5);
        String newRefreshToken = "";
        if( checkTime((Integer)claims.get("exp"))){
            newRefreshToken = JWTUtil.generateToken(claims,60*24);
        }else{
            newRefreshToken = refreshToken;
        }

        return Map.of("access_token",accessToken,"refresh_token",refreshToken);
    }

    private boolean checkTime(Integer exp) {
        java.util.Date expDate = new java.util.Date((long)exp*(1000)); // 밀리초로 변환
        long gap = expDate.getTime() - System.currentTimeMillis(); // 현재 시간과의 차이 계산
        long leftMin = gap / (1000*60);  // 분단위 변환
        // 1시간도 안남았는지
        return leftMin < 60;
    }

    private boolean checkExpiredToken(String accessToken) {
        try {
            JWTUtil.validateToken(accessToken);
        }catch( CustomJWTException ex ){
            if(ex.getMessage().equals("Expired")){
                return true;
            }
        }
        return false;
    }

}
