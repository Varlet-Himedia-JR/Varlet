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
        String username,
        String nickname,
        String password,
        String email,
        String phone,
        String provider,
        String snsid,
        String profileimg,
        String zip_code,
        String address,
        String d_address,
        Timestamp indate,
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
        this.userid = userid;
        this.name = username;
        this.nickname = nickname;
        this.pwd = password;
        this.email = email;
        this.phone = phone;
        this.provider = provider;
        this.snsid = snsid;
        this.profileimg = profileimg;
        this.zip_code = zip_code;
        this.address = address;
        this.d_address = d_address;
        this.indate = indate;
        this.isLogin = isLogin;
        this.roleNames = roleNames;
    }

    private String userid;
    private String email;
    private String name;
    private String nickname;
    private String pwd;
    private String phone;
    private String profileimg;
    private String zip_code;
    private String address;
    private Timestamp indate;
    private String provider;
    private String snsid;
    private String d_address;
    private Character isLogin;
    private List<String> roleNames = new ArrayList<String>();

    // JWT 토큰 생성시에 그 안에 넣을 개인 정보들을 Map 형식으로 구성합니다
    // 암호화 JWT 토큰 생성시에 그 Map 을 통째로 암호화합니다.
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("userid", userid);
        dataMap.put("email", email);
        dataMap.put("name", name);
        dataMap.put("pwd", pwd);
        dataMap.put("nickname", nickname);
        dataMap.put("phone", phone);
        dataMap.put("provider", provider);
        dataMap.put("snsid", snsid);
        dataMap.put("profileimg", profileimg);
        dataMap.put("roleNames", roleNames);
        dataMap.put("zip_code", zip_code);
        dataMap.put("address", address);
        dataMap.put("indate", indate);
        dataMap.put("d_address", d_address);
        dataMap.put("isLogin", isLogin);
        return dataMap;
    }


}
