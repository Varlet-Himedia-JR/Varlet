package com.himedias.varletserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Admin {

    @Id
    private String adminid; // 아이디

    private String pwd; // 패스워드

    private String name; // 이름

    private String phone; // 전화번호

    private String email; // 이메일
}

