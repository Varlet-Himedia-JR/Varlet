package com.himedias.varletserver.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
// 인터페이스를 구현하여 접근 거부 상황에서의 처리를 담당하는 클래스입니다.
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    // 접근이 거부된 경우 클라이언트에게 JSON 형식으로 오류 응답을 반환합니다.
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

        // Gson 객체를 사용하여 JSON 변환을 처리합니다.
        Gson gson = new Gson();

        // 오류 메시지를 JSON 문자열로 변환합니다.
        String jsonStr = gson.toJson(Map.of("error","ERROR_ACCESSDENIED"));

        // 응답의 콘텐츠 타입을 JSON으로 설정합니다.
        response.setContentType("application/json");

        // 응답 상태 코드를 403 Forbidden으로 설정합니다.
        response.setStatus(HttpStatus.FORBIDDEN.value());

        // 응답의 PrintWriter를 사용하여 JSON 문자열을 출력합니다.
        PrintWriter out = response.getWriter();
        out.print(jsonStr);

        // PrintWriter를 닫습니다.
        out.close();
    }
}
