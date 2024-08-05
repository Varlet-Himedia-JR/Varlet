package com.himedias.varletserver.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * 포인트 로그 데이터를 저장하는 DTO
 */
@Data
@Entity
public class PointLogDto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lnum;           // 로그 고유 번호
    private String userid;      // 사용자 ID
    private int rnum;           // 관련 게시글 번호 (외래키)
    private String record;      // 기록 유형 (예: 적립, 사용)
    private int amount;         // 포인트 양
    private String description; // 설명 (포인트 적립/차감 이유)
    private String date;        // 발생일자
}
