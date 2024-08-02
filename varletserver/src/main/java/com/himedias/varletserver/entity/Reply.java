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
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // 댓글의 고유 식별자 (기본 키)

    private String userid; // 리뷰 올린 사람

    private String writer;  // 댓글 작성자의 이름

    private String content; // 댓글 내용

    @CreationTimestamp
    private Timestamp writedate; // 댓글 작성 날짜 및 시간

}
