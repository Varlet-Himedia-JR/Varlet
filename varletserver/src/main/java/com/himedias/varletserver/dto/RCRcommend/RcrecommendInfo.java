package com.himedias.varletserver.dto.RCRcommend;

import com.himedias.varletserver.entity.Image;

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

    String getBerth();

    String getTour();

    RCommunityInfo getRnum();

    MemberInfo getUserid();

    List<ImageInfo> getImages();

    /**
     * Projection for {@link com.himedias.varletserver.entity.RCommunity}
     */
    interface RCommunityInfo {
        int getRnum();
    }

    /**
     * Projection for {@link com.himedias.varletserver.entity.Member}
     */
    interface MemberInfo {
        String getUserid();
    }

    /**
     * Projection for {@link com.himedias.varletserver.entity.Image}
     */
    interface ImageInfo {
        Long getId();

        String getImageName();

        String getFilePath();

        Timestamp getUploadDate();

        Image.ImageType getImageType();
    }
}