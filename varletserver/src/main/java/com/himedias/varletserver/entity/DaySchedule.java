package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DaySchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tseq;
    private String userid;
    private Timestamp day_date;
    private Timestamp start_time;
    private Timestamp end_time;
    private int cseq;
    private int price;
    private int pcount;
}