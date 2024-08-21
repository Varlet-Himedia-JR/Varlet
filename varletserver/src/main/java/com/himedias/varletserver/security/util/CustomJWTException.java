package com.himedias.varletserver.security.util;
// 사용자 정의 예외 클래스입니다.
public class CustomJWTException extends Exception {

    // 생성자: 예외 메시지를 입력받아 상위 클래스의 생성자를 호출합니다.
    public CustomJWTException(String msg) {
        super(msg); // 예외 메시지를 상위 클래스(Exception) 생성자에 전달합니다.
    }
}

