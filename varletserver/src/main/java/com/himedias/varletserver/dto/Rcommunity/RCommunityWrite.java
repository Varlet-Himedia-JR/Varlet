package com.himedias.varletserver.dto.Rcommunity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Getter
@Setter
@Transactional
public class RCommunityWrite {
    private String userid;
    private int location;
    private int location2;
    private int reward;
    private String title;
    private String content;
    private Timestamp startdate;  // 추가된 필드
    private Timestamp enddate;
}