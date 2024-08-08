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
    private int renum; // 답글 번호 (Primary Key)

    private int rseq; // 리뷰 시퀀스 (리뷰와 연결된 시퀀스)

    private String userid; // 사용자 ID

    private String content; // 답글 내용

    @CreationTimestamp
    private Timestamp writedate; // 답글 작성 날짜
}
