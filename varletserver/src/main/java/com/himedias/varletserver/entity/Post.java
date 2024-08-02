package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "post")
public class Post {

        @jakarta.persistence.Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "pseq", nullable = false)
        private int pseq;       //게시글 번호

        @Column(nullable = false)
        private String title; // 게시글 제목

        @Column(nullable = false)
        private String content; // 게시글 내용

        @Column(nullable = false)
        private int location; // 지역 대분류

        @Column(nullable = false)
        private int location2;  // 지역 소분류

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "userid", referencedColumnName = "userid")
        private Member member; // 외래 키로서의 회원


        @Column(nullable = false)
        private Timestamp writedate; // 생성일

        @Column(nullable = false)
        private int viewCount = 0; // 조회수

        private int suggest = 0;        //추천 수

        private int reword;     // 설정된 포인트

        private char select;    //채택여부

    }


