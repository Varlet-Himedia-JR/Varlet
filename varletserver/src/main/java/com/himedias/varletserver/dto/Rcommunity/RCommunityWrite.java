package com.himedias.varletserver.dto.Rcommunity;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Getter
@Setter
public class RCommunityWrite {
    private String userid;
    private int location;
    private int location2;
    private int reward;
    private String title;
    private String content;
}