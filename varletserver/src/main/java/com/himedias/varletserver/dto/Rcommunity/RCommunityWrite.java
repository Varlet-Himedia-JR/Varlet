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
    MemberDto userid;
    private char picked = 'N';  // 기본값 설정

    /**
     * DTO for {@link com.himedias.varletserver.entity.Member}
     */
    @Value
    public static class MemberDto implements Serializable {
        @Size(max = 50)
        String userid;
        @Size(max = 10)
        String name;
        @Size(max = 10)
        String nickname;
        @Size(max = 50)
        String provider;
        @Size(max = 50)
        String snsid;
        @Size(max = 300)
        String profileimg;
        Integer point;
    }
}
