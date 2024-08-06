package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Entity
@Table(name = "rcrecommend")
@Data
public class RCRecommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rcnum")
    private int rcnum;

    @Column(name = "userid")
    private String userid;

    @Column(name = "rnum")
    private int rnum;

    @Column(name = "location")
    private int location;

    @Column(name = "location2")
    private int location2;

    @Column(name = "writedate")
    private Timestamp writedate;

    @Column(name = "rsuggest")
    private Integer rsuggest;

    @Column(name = "views")
    private Integer views;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "select")
    private String select;

}
