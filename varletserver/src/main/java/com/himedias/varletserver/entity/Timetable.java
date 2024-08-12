package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.time.Instant;

@Data
@Entity
public class Timetable {

    @Id
    private int tseq;


    @Size(max = 50)
    @Column(name = "userid", nullable = false, length = 50)
    private String userid;

    @Size(max = 20)
    @Column(name = "tname", length = 20)
    private String tname;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "start_date")
    private Timestamp start_date;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "end_date")
    private Timestamp end_date;

    @Size(max = 1000)
    @Column(name = "description", length = 1000)
    private String description;

}