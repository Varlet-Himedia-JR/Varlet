package com.himedias.varletserver.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "memberRoleList")
public class Member {
    @Id
    @Column(name = "userid", nullable = false)
    private String userid;
    private String pwd;
    private String name;
    private String nickname;
    private String email;
    private String phone;
    private String zip_code;
    private String address;
    private String d_address;
    private String provider;
    private String snsid;
    private String isLogin; //yn
}