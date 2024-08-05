package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "Qna")
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qseq")
    private Integer qseq;

    @Id
    @Column(name = "userid")
    private String userid;

    @Column(name = "subject")
    private String subject;

    @Column(name = "content")
    private String content;

    @Column(name = "indate")
    private Timestamp indate;

    @Column(name = "reply")
    private String reply;

    @Column(name = "replydate")
    private Timestamp replydate;
}