package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "post")
public class RPost {

    @Id
    @Column(name = "rnum", nullable = false)
    private int rnum;

    private int pseq;       //게시글 번호(외래키)

    private Member member; // 외래 키로서의 회원

    private String title; // 게시글 제목

    private String content; // 게시글 내용

    private int location; // 지역 대분류

    private int location2;  // 지역 소분류

    private Timestamp writedate; // 생성일

    private int suggest = 0;        //추천 수

    private char select;    //채택여부

}
