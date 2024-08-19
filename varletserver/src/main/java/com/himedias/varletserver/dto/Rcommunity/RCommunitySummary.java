package com.himedias.varletserver.dto.Rcommunity;

import java.sql.Timestamp;

/**
 * Projection for {@link com.himedias.varletserver.entity.RCommunity}
 */
public interface RCommunitySummary {
    int getRnum();
    String getUserid();  // 여기서 메서드명을 getUserId로 수정
    int getLocation();
    int getLocation2();
    Timestamp getWritedate();
    Integer getViews();
    String getTitle();
    int getReward();
    char getPicked();
    int getReplyCount();


}