package com.himedias.varletserver.dto.Rcommunity;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class RCRecommendDto {

    private int rcnum;
    private String userid;
    private int rnum;
    private int location;
    private int location2;
    private Timestamp writedate;
    private Integer rsuggest;
    private Integer views;
    private String title;
    private String content;
    private String select;

}