package com.himedias.varletserver.dto.Rcommunity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Getter
@Setter
public class RCommunityWrite {

    @NotBlank
    @Size(max = 50)
    private String userid;  // 사용자 ID

    @NotNull
    private int location;

    @NotNull
    private int location2;

    @NotNull
    private int reward;

    @NotBlank
    @Size(min = 1, max = 50)  // 제목의 최소, 최대 길이 제약 조건을 추가
    private String title;

    @NotBlank
    @Size(min = 1, max = 2500)  // 내용의 최소, 최대 길이 제약 조건을 추가
    private String content;

    @NotNull
    private Timestamp startdate;

    @NotNull
    private Timestamp enddate;

    private char picked = 'N';  // 기본값 설정
}
