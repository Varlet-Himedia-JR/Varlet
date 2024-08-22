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

    // 로그인 성공 후 호출되는 메소드입니다.
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // getClaim 사용자 정보가 담긴 Map 추출하고, JWT 데이터를 추가해서 클라이언트로 전송

        // 인증 객체에서 사용자 정보를 추출합니다.
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

        // authenrication 에는 로그인에 성공한 사용자정보 DTO가 담겨있고, getPrincipal 로 추출
        Map<String,Object> claims = memberDTO.getClaims(); // 사용자 정보가 담긴 Map을 추출합니다.


        // 엑세스 토큰 + 리프레시 토큰 생성
        String accessToken = JWTUtil.generateToken(claims,1); // 엑세스 토큰: 1분 유효
        String refreshToken = JWTUtil.generateToken(claims, 60*3); // 리프레시 토큰: 24시간 유효

        // 생성된 토큰을 claims에 추가합니다.
        claims.put("access_token",accessToken);
        claims.put("refresh_token",refreshToken);

        // Gson 객체를 사용하여 claims를 JSON 문자열로 변환합니다.
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        log.info("jsonStr" + jsonStr);

        // 응답의 콘텐츠 타입을 JSON으로 설정합니다.
        response.setContentType("application/json");

        // 응답의 문자 인코딩을 UTF-8로 설정합니다.
        response.setCharacterEncoding("UTF-8");

        // 응답의 PrintWriter를 사용하여 JSON 문자열을 출력합니다.
        PrintWriter printWriter = response.getWriter();
        printWriter.print(jsonStr);

        // PrintWriter를 닫아 자원을 해제합니다.
        printWriter.close();
    }

}
