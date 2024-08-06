package com.himedias.varletserver.dto;

import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Value
public class RCommunityWrite implements Serializable {
    String userid;
    int location;
    int location2;
    String title;
    String content;
    int reward;
}