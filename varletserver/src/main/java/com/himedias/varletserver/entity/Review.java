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
    private Integer rseq;           // 리뷰의 고유 식별자 (기본 키)

    private String userid;          // 리뷰 작성자의 사용자 ID

    private int readcount;          // 리뷰의 조회 수

    private String title;           // 리뷰의 제목

    private String reviewimg;       // 리뷰 이미지 URL 또는 경로

    private String content;         // 리뷰 내용

    @CreationTimestamp
    private Timestamp indate;       // 리뷰 작성 일시

}
