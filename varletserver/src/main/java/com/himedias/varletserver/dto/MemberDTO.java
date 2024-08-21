package com.himedias.varletserver.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;


public class MemberDTO extends User {

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
        List<String> roleNames
        ) {
        // 부모 클래스인 User의 생성자를 호출합니다.
        // 이때 사용자의 권한을 SimpleGrantedAuthority 객체로 변환하여 전달합니다.
        super(userid, password,
                roleNames.stream().map(
                        str -> new SimpleGrantedAuthority("ROLE_" + str)
                ).collect(Collectors.toList())
                // ROLE_USER, ROLE_ADMIN, ROLE_MANAGER 와 같은 String 데이터 생성
        );
        // 생성자에 전달된 전달인수들을 멤버변수에 저장
        this.userid = userid;
        this.pwd = password;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.profileimg = profileimg;
        this.zipCode = zipCode;
        this.address = address;
        this.dAddress = d_address;
        this.provider = provider;
        this.snsid = snsid;
        this.indate = indate;
        this.isLogin = isLogin;
        this.roleNames = roleNames;
    }
    private String userid;
    private String pwd;
    private String name;
    private String nickname;
    private String email;
    private String phone;
    private String profileimg;
    private String zipCode;
    private String address;
    private String dAddress;
    private String provider;
    private String snsid;
    private Timestamp indate;
    private Character isLogin;
    private List<String> roleNames = new ArrayList<String>();

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
        dataMap.put("profileimg", profileimg);
        dataMap.put("zipCode", zipCode);
        dataMap.put("address", address);
        dataMap.put("dAddress", dAddress);
        dataMap.put("provider", provider);
        dataMap.put("snsid", snsid);
        dataMap.put("indate", indate);
        dataMap.put("isLogin", isLogin);
        dataMap.put("roleNames", roleNames);
        return dataMap;
    }


}
