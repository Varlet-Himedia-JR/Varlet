package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "dayschedule")
public class Dayschedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dseq", nullable = false)
    private Integer dseq;

    @NotNull
    @Column(name = "dtitle", nullable = false)
    private String dtitle;

    @NotNull
    @Column(name = "cseq", nullable = false)
    private Integer cseq;

    @Size(max = 50)
    @NotNull
    @Column(name = "userid", nullable = false, length = 50)
    private String userid;

    @NotNull
    @Column(name = "tseq", nullable = false)
    private int tseq;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "day_date", nullable = false)
    private Timestamp day_date;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "start_time", nullable = false)
    private Timestamp start_time;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "end_time", nullable = false)
    private Timestamp end_time;

    @Column(name = "price")
    private int price;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "pcount", nullable = false)
    private int pcount;

}