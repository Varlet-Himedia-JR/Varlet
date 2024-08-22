package com.himedias.varletserver.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

public class MemberDTO extends User {

    // 생성자 추가 (포인트 필드 포함)
    public MemberDTO(

            String userid,
            String password,
            String name,
            String nickname,
            String email,
            String phone,
            String zipCode,
            String address,
            String d_address,
            String profileimg,
            String provider,
            String snsid,
            Timestamp indate,
            Character isLogin,
            List<String> roleNames,
            Integer point // 추가된 포인트 필드
    ) {

        super(userid, password,
                roleNames.stream().map(
                        str -> new SimpleGrantedAuthority("ROLE_" + str)
                ).collect(Collectors.toList())
        );
        this.userid = userid;
        this.pwd = password;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.zip_code = zip_code;
        this.address = address;
        this.d_address = d_address;
        this.provider = provider;
        this.snsid = snsid;
        this.profileimg = profileimg;
        this.indate = indate;
        this.isLogin = isLogin;
        this.point = point;
        this.roleNames = roleNames;
        this.point = point; // 포인트 필드 초기화

    }

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
    private String profileimg;
    private Timestamp indate;
    private Character isLogin;
    private List<String> roleNames = new ArrayList<>();
    private Integer point; // 추가된 포인트 필드


    // JWT 토큰 생성시에 그 안에 넣을 개인 정보들을 Map 형식으로 구성합니다
    // 암호화 JWT 토큰 생성시에 그 Map 을 통째로 암호화합니다.
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("userid", userid);
        dataMap.put("pwd", pwd);
        dataMap.put("name", name);
        dataMap.put("nickname", nickname);
        dataMap.put("email", email);
        dataMap.put("phone", phone);
        dataMap.put("zip_code", zip_code);
        dataMap.put("address", address);
        dataMap.put("d_address", d_address);
        dataMap.put("provider", provider);
        dataMap.put("snsid", snsid);
        dataMap.put("profileimg", profileimg);
        dataMap.put("indate", indate);
        dataMap.put("isLogin", isLogin);
        dataMap.put("point", point);
        dataMap.put("roleNames", roleNames);
        dataMap.put("point", point); // 포인트 필드 추가
        return dataMap;
    }
}
