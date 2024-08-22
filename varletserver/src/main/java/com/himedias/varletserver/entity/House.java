package com.himedias.varletserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
@Data
@Entity
public class House {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int hseq;
        private String type;
        private String hname;
        private String content;
        private String cost;
        private Character like;
}
