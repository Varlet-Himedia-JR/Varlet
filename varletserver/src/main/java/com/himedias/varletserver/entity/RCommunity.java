package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "rcommunity")
public class RCommunity {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rnum;

    @Getter
    @Setter
    @Column(name = "userid", nullable = false, length = 50)
    private String userid;  // 여기서 필드명을 userId로 수정

    @Getter
    @Setter
    @Column(nullable = false)
    private int location;

    @Getter
    @Setter
    @Column(nullable = false)
    private int location2;

    @Getter
    @Setter
    @Column(nullable = false, columnDefinition = "int default 0")
    private int views;

    @Getter
    @Setter
    @Column(nullable = false, length = 50)
    private String title;

    @Getter
    @Setter
    @Column(nullable = false, length = 2500)
    private String content;

    @Getter
    @Setter
    @Column(nullable = false, columnDefinition = "int default 0")
    private int reward;

    @Getter
    @Setter
    @Column(nullable = false, columnDefinition = "char(1) default 'N'")
    private char picked;

    @Getter
    @Setter
    @Column(nullable = false, updatable = false, insertable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private Timestamp writedate;

    @Getter
    @Setter
    @Column(name = "startdate", nullable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private Timestamp startdate;

    @Getter
    @Setter
    @Column(name = "enddate", nullable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private Timestamp enddate;


    @PrePersist
    public void prePersist() {
        if (this.picked == '\u0000') {  // picked 필드의 기본값이 설정되지 않은 경우
            this.picked = 'N';
        }
    }
}

