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
        private int pseq;

        @Column(nullable = false)
        private String title; // 게시글 제목

        @Column(nullable = false)
        private String content; // 게시글 내용

        @Column(nullable = false)
        private int kind; // 게시글 유형 (예: 특정 카테고리나 지역을 나타내는 정수형 값)

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "userid", referencedColumnName = "userid")
        private Member member; // 외래 키로서의 회원


        @Column(nullable = false)
        private Timestamp writedate; // 생성일

        @Column(nullable = false)
        private int viewCount = 0; // 조회수

        // 생성자, getter, setter
    }


}