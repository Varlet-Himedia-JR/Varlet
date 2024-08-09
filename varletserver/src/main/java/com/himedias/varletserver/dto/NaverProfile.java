package com.himedias.varletserver.dto;

public class NaverProfile {
    private String resultcode;
    private String message;
    private Response response; // 내부 클래스를 사용

    public String getResultcode() {
        return resultcode;
    }

    public String getMessage() {
        return message;
    }

    public Response getResponse() {
        return response;
    }

    public static class Response {
        private String id;
        private String nickname;
        private String email;

        public String getId() {
            return id;
        }
        public void setId(String id) {
            this.id = id;
        }

        public String getNickname() {
            return nickname;
        }
        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }
    }
}