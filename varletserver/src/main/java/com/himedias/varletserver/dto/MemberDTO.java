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
        String zip_code,
        String address,
        String d_address,
        Timestamp indate,
        Character is_login,
        String provider,
        String snsid,
        String profileimg,
        Integer point,
        List<String> roleNames
        ) {
        // 부모 클래스인 User의 생성자를 호출합니다.
        // 이때 사용자의 권한을 SimpleGrantedAuthority 객체로 변환하여 전달합니다.
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
        this.indate = indate;
        this.is_login = is_login;
        this.provider = provider;
        this.snsid = snsid;
        this.profileimg = profileimg;
        this.roleNames = roleNames;
        this.point = point; // 포인트 필드 초기화

    }


    // MemberDTO 클래스의 멤버 변수들에 대한 getter 메소드들이 자동 생성된 것으로 가정합니다.
    // 각 멤버 변수는 해당 클래스의 인스턴스가 가지는 사용자 정보와 관련된 데이터를 저장합니다

    private String userid;
    private String pwd;
    private String name;
    private String nickname;
    private String email;
    private String phone;
    private String zip_code;
    private String address;
    private String d_address;
    private Timestamp indate;
    private Character is_login;
    private String provider;
    private String snsid;
    private String profileimg;
    private Integer point;
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
        dataMap.put("zip_code", zip_code);
        dataMap.put("address", address);
        dataMap.put("d_address", d_address);
        dataMap.put("indate", indate);
        dataMap.put("is_login", is_login);
        dataMap.put("provider", provider);
        dataMap.put("snsid", snsid);
        dataMap.put("profileimg", profileimg);
        dataMap.put("point", point);
        dataMap.put("roleNames", roleNames);
        dataMap.put("point", point); // 포인트 필드 추가
        return dataMap;
    }
}
