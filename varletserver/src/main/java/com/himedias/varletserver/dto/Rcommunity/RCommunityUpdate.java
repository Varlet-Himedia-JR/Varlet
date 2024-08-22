package com.himedias.varletserver.dto.Rcommunity;

import lombok.Value;

import java.sql.Timestamp;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Value
public class RCommunityUpdate {

    int location;
    int location2;
    String title;
    String content;
    int reward;
    Timestamp startdate;
    Timestamp enddate;
    String userid;
    private char picked = 'N';  // 기본값 설정

}
