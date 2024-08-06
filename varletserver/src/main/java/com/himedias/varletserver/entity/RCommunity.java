package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Entity
@Table(name = "rcommunity")
@Data
public class RCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rnum;

    @Column(nullable = false)
    private int location;

    @Column(nullable = false)
    private int location2;

    @Column(nullable = false, updatable = false)
    private Timestamp writedate;

    private Integer suggest;  // Integer를 사용하여 null 가능성을 표현

    private Integer views;    // Integer를 사용하여 null 가능성을 표현

    @Column(length = 255)
    private String title;

    @Column(length = 255)
    private String content;

    @Column(nullable = false)
    private int reward;

    @Column(length = 255)
    private String picked;

}
