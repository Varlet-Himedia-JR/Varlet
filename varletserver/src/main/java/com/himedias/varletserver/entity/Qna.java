package com.himedias.varletserver.entity;

import jakarta.persistence.*;
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
    private Character security;
    private String subject;
    private String content;
    @CreationTimestamp
    private Timestamp indate;
    private String reply;
    private Timestamp replydate;


    @PrePersist
    public void prePersist() {
        if (security == null) {
            security = 'N';
        }
    }
}