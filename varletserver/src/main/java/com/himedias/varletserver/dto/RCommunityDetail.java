package com.himedias.varletserver.dto;

import lombok.Value;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Value
public class RCommunityDetail implements Serializable {
    int rnum;
    String userid;
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