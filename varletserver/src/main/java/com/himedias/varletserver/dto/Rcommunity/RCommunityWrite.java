package com.himedias.varletserver.dto.Rcommunity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Value
public class RCommunityWrite {

    int location;
    int location2;
    String title;
    String content;
    int reward;
    Timestamp startdate;
    Timestamp enddate;
    String userid;
    char picked = 'N';  // 기본값 설정

}
