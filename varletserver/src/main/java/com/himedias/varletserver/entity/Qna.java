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
public class Qna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int qseq;
    private String userid;
    private String pass;
    private String security;
    private String subject;
    private String content;
    @CreationTimestamp
    private Timestamp indate;
    private String reply;
    private Timestamp replydate;

}