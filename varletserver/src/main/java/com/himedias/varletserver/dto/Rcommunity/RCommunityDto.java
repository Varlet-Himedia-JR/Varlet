package com.himedias.varletserver.dto.Rcommunity;

import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Value
@Getter
@Setter
public class RCommunityDto implements Serializable {
    int rnum;
    int location;
    int location2;
    Timestamp writedate;
    Integer suggest;
    Integer views;
    String title;
    String content;
    int reward;
    String picked;
}