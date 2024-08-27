package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "memberRoleList")
@Table(name = "member")
public class Member {
    @Id
    @Size(max = 50)
    @Column(name = "userid", nullable = false, length = 50)
    private String userid;

    @Size(max = 300)
    @Column(name = "pwd", length = 300)
    private String pwd;

    @Size(max = 10)
    @Column(name = "name", length = 10)
    private String name;

    @Size(max = 10)
    @Column(name = "nickname", length = 10)
    private String nickname;

    @Size(max = 50)
    @Column(name = "email", length = 50)
    private String email;

    @Size(max = 15)
    @Column(name = "phone", length = 15)
    private String phone;

    @Size(max = 20)
    @Column(name = "zip_code", length = 20)
    private String zip_code;

    @Size(max = 100)
    @Column(name = "address", length = 100)
    private String address;

    @Size(max = 100)
    @Column(name = "d_address", length = 100)
    private String d_address;

    @Column(name = "indate")
    @ColumnDefault("CURRENT_TIMESTAMP")
    private Timestamp indate;

    @Column(name = "is_login")
    private Character is_login;

    @Size(max = 50)
    @Column(name = "provider", length = 50)
    private String provider;

    @Size(max = 50)
    @Column(name = "snsid", length = 50)
    private String snsid;

//    @Column(name = "point", length = 100)
//    private int point;

    @Size(max = 300)
    @Column(name = "profileimg", length = 300)
    private String profileimg;

    // 추가된 필드
    @Column(name = "point")
    @ColumnDefault("0") // 기본값 설정
    private Integer point;

    // 사용자의 등급별 권한들이 저장
    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default // Default: new ArrayList<>() 비어있는 리스트로 객체 저장
    private List<MemberRole> memberRoleList = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (is_login == null) {
            is_login = 'Y';
        }
        if (provider == null) {
            provider = "local";
        }
        if (indate == null) {
            indate = Timestamp.from(Instant.now());
        }
        if (point == null) {
            point = 0;
        }
    }
}
