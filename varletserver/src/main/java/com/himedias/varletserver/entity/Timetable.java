package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tseq", nullable = false)
    private int tseq;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "userid", nullable = false, referencedColumnName = "userid")
    private Member member;

    private String tname;
    private Date start_date;
    private Date end_date;
    private String description;
}
