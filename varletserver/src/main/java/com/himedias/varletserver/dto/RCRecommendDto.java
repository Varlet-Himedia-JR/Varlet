package com.himedias.varletserver.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 추천 댓글 데이터를 저장하는 DTO
 */
@Data
@Entity
public class RCRecommendDto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rcnum;          // 댓글 고유 번호
    private String userid;      // 작성자 ID
    private int rnum;           // 게시글 번호 (외래키)
    private int location;       // 위치 (도, 특별시 등)
    private int location2;      // 세부 위치 (시, 군, 구 등)
    private String writedate;   // 작성일자
    private Integer rsuggest;   // 추천 수
    private Integer views;      // 조회 수
    private String title;       // 제목
    private String content;     // 내용
    private char select;        // 채택 여부 ('Y' 또는 'N')
}