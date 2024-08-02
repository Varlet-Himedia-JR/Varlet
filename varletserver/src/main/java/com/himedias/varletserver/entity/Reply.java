package com.himedias.varletserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int renum;             // 댓글의 고유 식별자 (기본 키)

    private int rseq;              // 댓글이 속한 엔티티의 식별자 (게시물 번호)

    private String userid;         // 댓글 작성자의 사용자 ID

    private String content;        // 댓글 내용

    @CreationTimestamp
    private Timestamp writedate;   // 댓글 작성 일시
}
