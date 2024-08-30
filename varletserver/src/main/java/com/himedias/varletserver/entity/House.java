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
        private String hname;
        private String hcontent;
        private String phone;
        private String cost;
        @CreationTimestamp
        private Timestamp indate;
        private Character like;
        private String house_image;
        private int review_count;
}
