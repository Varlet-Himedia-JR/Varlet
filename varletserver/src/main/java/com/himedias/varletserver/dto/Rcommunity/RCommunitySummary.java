package com.himedias.varletserver.dto.Rcommunity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * Projection for {@link com.himedias.varletserver.entity.RCommunity}
 */
public interface RCommunitySummary {
    int getRnum();

    int getLocation();

    int getLocation2();

    int getViews();

    String getTitle();

    char getPicked();

    LocalDateTime getWritedate();

    MemberInfo getUserid();

    int getReplyCount();

    /**
     * Projection for {@link com.himedias.varletserver.entity.Member}
     */
    interface MemberInfo {

        String getUserid();

    }


}