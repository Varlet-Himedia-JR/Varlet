package com.himedias.varletserver.entity;

import java.sql.Timestamp;

/**
 * Projection for {@link Review}
 */
public interface ReviewSummary {
    int getRseq();

    String getUserid();

    String getTitle();

    Timestamp getIndate();

    int getReadcount();
}