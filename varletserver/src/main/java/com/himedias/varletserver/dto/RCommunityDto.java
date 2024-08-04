package com.himedias.varletserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.sql.Timestamp;

/**
 * 커뮤니티 게시글 엔티티
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "RCommunity")
public class RCommunityDto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rnum") // 게시글 번호 컬럼
    private Integer rnum; // 게시글 번호

    private String userid; // 사용자 ID

    private Integer location; // 위치 (대분류)

    private Integer location2; // 위치2 (소분류)

    private Timestamp writedate; // 작성일자

    private Integer suggest; // 추천 수

    private Integer views; // 조회 수

    private String title; // 제목

    private String content; // 내용

    private Integer reward; // 보상 포인트

    private String select; // 채택 여부
}
