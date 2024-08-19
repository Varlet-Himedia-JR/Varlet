package com.himedias.varletserver.dto.RCRcommend;

import java.sql.Timestamp;
import java.util.List;

/**
 * Projection for {@link com.himedias.varletserver.entity.Rcrecommend}
 */
public interface RcrecommendInfo {
    Integer getRcnum();

    String getContent();

    Character getRpicked();

    Timestamp getWritedate();

    MemberInfo getUserid();

    List<ImageInfo> getImages();

    /**
     * Projection for {@link com.himedias.varletserver.entity.Member}
     */
    interface MemberInfo {
        String getUserid();

        String getNickname();

        String getProfileimg();
    }

    /**
     * Projection for {@link com.himedias.varletserver.entity.Image}
     */
    interface ImageInfo {
        String getFilePath();
    }
}