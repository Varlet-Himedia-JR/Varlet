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
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer rseq; // 리뷰의 고유 식별자 (기본 키)

    private int readcount; // 리뷰 조회수

    private String title; // 제목

    private String reviewimg; // 리뷰에 올릴 사진

    private String content; // 내용

    @CreationTimestamp
    private Timestamp indate; // 리뷰 쓴 날짜

    private String userid; // 리뷰 작성자
}
