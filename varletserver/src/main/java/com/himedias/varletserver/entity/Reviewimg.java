package com.himedias.varletserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "reviewimg")
@NoArgsConstructor
public class Reviewimg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int iseq;

    @Column(nullable = false)
    private int rseq;

    private String ipath;

    private String iname;

    @ManyToOne
    @JoinColumn(name = "rseq", insertable = false, updatable = false)
    private Review review;
}
