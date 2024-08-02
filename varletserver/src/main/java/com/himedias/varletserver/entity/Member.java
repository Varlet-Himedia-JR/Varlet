package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default // Default: new ArrayList<>() 비어있는 리스트로 객체 저장
    private List<MemberRole> memberRoleList = new ArrayList<MemberRole>();


    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Timetable> timetables;
}
