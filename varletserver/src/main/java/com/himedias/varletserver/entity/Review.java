package com.himedias.varletserver.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int rseq; // 리뷰 시퀀스 (Primary Key)

    private String userid; // 사용자 ID

    private String title; // 리뷰 제목

    private String content; // 리뷰 내용

    @CreationTimestamp
    private Timestamp indate; // 리뷰 작성 날짜

    private int readcount; // 조회수

    private String reviewimg; // 리뷰 이미지 경로

}
