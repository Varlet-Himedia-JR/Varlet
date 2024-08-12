package com.himedias.varletserver.dto.Rcommunity;

import java.sql.Timestamp;

/**
 * Projection for {@link com.himedias.varletserver.entity.RCommunity}
 */
public interface RCommunityDetail {
    int getRnum();

    String getUserid();

    int getLocation();

    int getLocation2();

    int getViews();

    String getTitle();

    String getContent();

    int getReward();

    char getPicked();

    Timestamp getWritedate();

    Timestamp getStartdate();

    Timestamp getEnddate();
}