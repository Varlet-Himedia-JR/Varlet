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

/**
 * 포인트 엔티티
 */
@Data
@Entity
public class PointDto {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer pnum; // 포인트 ID

        private String userid; // 사용자 ID
}
