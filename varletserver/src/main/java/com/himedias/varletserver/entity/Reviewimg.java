package com.himedias.varletserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "reviewimg") // 엔티티와 매핑될 테이블 이름
@NoArgsConstructor
public class Reviewimg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int iseq; // 이미지 시퀀스 (Primary Key)

    @Column(nullable = false)
    private int rseq; // 리뷰 번호 (Foreign Key)

    private String ipath; // 파일 경로

    private String iname; // 이미지 이름

    @ManyToOne
    @JoinColumn(name = "rseq", insertable = false, updatable = false)
    private Review review; // Review 엔티티와의 관계 설정

}

