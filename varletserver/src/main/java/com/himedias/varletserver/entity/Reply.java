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
    private int renum; // 댓글 시퀀스 (Primary Key)

    private int rseq; // 리뷰 시퀀스 (댓글이 달린 리뷰의 ID)

    private String userid; // 사용자 ID (댓글 작성자)

    private String content; // 댓글 내용

    @CreationTimestamp
    private Timestamp writedate; // 댓글 작성 날짜
}
