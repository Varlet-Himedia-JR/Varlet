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
public class Notice {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int nseq; // 공지사항의 고유 식별자 (기본 키)

    private String adminid; // 공지사항 작성자

    private String subject; // 공지사항의 제목

    private String content; // 공지사항 내용

    @CreationTimestamp
    private Timestamp indate; // 공지사항 작성 일시
}
