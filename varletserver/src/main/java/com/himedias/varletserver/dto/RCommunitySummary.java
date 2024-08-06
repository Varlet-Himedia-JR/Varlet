package com.himedias.varletserver.dto;

import java.sql.Timestamp;

/**
 * Projection for {@link com.himedias.varletserver.entity.RCommunity}
 */
public interface RCommunitySummary {
    int getRnum();

    String getUserid();

    int getLocation();

    int getLocation2();

    Timestamp getWritedate();

    Integer getSuggest();

    Integer getViews();

    String getTitle();

    int getReward();

    String getPicked();
}