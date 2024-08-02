package com.himedias.varletserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Pay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int qseq;
    private int cseq;

}
