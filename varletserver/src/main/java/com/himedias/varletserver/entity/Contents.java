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
public class Contents {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cseq;
    private String ctype;
    private String cname;
    private String location;
    private String location2;
    @CreationTimestamp
    private Timestamp cstartTime;
    @CreationTimestamp
    private Timestamp cendTime;
    @CreationTimestamp
    private int cost;
    private String contentsimg;

}
