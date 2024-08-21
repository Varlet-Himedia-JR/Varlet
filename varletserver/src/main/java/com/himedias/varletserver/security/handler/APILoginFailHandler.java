package com.himedias.varletserver.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class APILoginFailHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.info("Login fail...." + exception);

        // Gson 객체를 사용하여 JSON 변환을 처리합니다.
        Gson gson = new Gson();

        // 오류 메시지를 JSON 문자열로 변환합니다.
        String jsonStr = gson.toJson(Map.of("error","ERROR_LOGIN"));

        // 응답의 콘텐츠 타입을 JSON으로 설정합니다.
        response.setContentType("application/json");

        // 응답의 PrintWriter를 사용하여 JSON 문자열을 출력합니다.
        PrintWriter printWriter = response.getWriter();
        printWriter.print(jsonStr);

        // PrintWriter를 닫습니다.
        printWriter.close();
    }
}
