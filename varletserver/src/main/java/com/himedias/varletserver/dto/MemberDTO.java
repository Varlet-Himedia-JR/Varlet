package com.himedias.varletserver.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.sql.Date;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;


public class MemberDTO extends User {

    public MemberDTO(
        String username,
        String password,
        String email,
        String phone,
        String provider,
        String snsid,
        String profileimg,
        String zipCode,
        String address,
        String dAddress,
        Instant indate,
        Character isLogin,
        List<String> roleNames
        ) {
        super(username, password,
                roleNames.stream().map(
                        str -> new SimpleGrantedAuthority("ROLE_" + str)
                ).collect(Collectors.toList())
                // ROLE_USER, ROLE_ADMIN, ROLE_MANAGER 와 같은 String 데이터 생성
        );
        // 생성자에 전달된 전달인수들을 멤버변수에 저장
        this.nickname = username;
        this.pwd = password;
        this.email = email;
        this.phone = phone;
        this.provider = provider;
        this.snsid = snsid;
        this.profileimg = profileimg;
        this.zipCode = zipCode;
        this.address = address;
        this.dAddress = dAddress;
        this.indate = indate;
        this.isLogin = isLogin;
        this.roleNames = roleNames;
    }

    private String email;
    private String nickname;
    private String pwd;
    private String phone;
    private String profileimg;
    private String zipCode;
    private String address;
    private Instant indate;
    private String provider;
    private String snsid;
    private String dAddress;
    private Character isLogin;
    private List<String> roleNames = new ArrayList<String>();

    // JWT 토큰 생성시에 그 안에 넣을 개인 정보들을 Map 형식으로 구성합니다
    // 암호화 JWT 토큰 생성시에 그 Map 을 통째로 암호화합니다.
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("email", email);
        dataMap.put("pwd", pwd);
        dataMap.put("nickname", nickname);
        dataMap.put("phone", phone);
        dataMap.put("provider", provider);
        dataMap.put("snsid", snsid);
        dataMap.put("profileimg", profileimg);
        dataMap.put("roleNames", roleNames);
        return dataMap;
    }


}
