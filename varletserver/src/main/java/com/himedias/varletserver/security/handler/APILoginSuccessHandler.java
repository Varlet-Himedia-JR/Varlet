package com.himedias.varletserver.security.handler;

import com.google.gson.Gson;

import com.himedias.varletserver.dto.MemberDTO;
import com.himedias.varletserver.security.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // getClaim 사용자 정보가 담긴 Map 추출하고, JWT 데이터를 추가해서 클라이언트로 전송
        // authenrication 에는 로그인에 성공한 사용자정보 DTO가 담겨있고, getPrincipal 로 추출
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
        Map<String,Object> claims = memberDTO.getClaims();

        // 엑세스 토큰 + 리프레시 토큰 생성
        String accessToken = JWTUtil.generateToken(claims,5);
        String refreshToken = JWTUtil.generateToken(claims, 60*24);

        claims.put("access_token",accessToken);
        claims.put("refresh_token",refreshToken);

        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);
        log.info("jsonStr" + jsonStr);
        response.setContentType("application/json");

        response.setCharacterEncoding("UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.print(jsonStr);
        printWriter.close();
    }

}
