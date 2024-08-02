package com.himedias.varletserver.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "point_log")
public class PointLog {
    @Id
    @Column(name = "lseq", nullable = false)
    private Long lseq;  // 변동기록

    private String user;    //멤버 테이블 참조

    private int amount; //변동 수량

    private String description; //변동 내역

    private Timestamp logDate;  //변동내역 발생일


}
