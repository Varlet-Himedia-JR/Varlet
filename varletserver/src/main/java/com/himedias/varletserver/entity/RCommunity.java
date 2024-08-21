package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "rcommunity")
@Getter
@Setter
public class RCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rnum;

    @Column(nullable = false)
    private int location;

    @Column(nullable = false)
    private int location2;

    @Column(nullable = false)
    private int views = 0;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 2500)
    private String content;

    @Column(nullable = false)
    private int reward = 0;

    @Column(nullable = false, length = 1)
    private char picked = 'N';

    @Column(nullable = false)
    private LocalDateTime writedate = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime startdate = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime enddate = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userid", nullable = false)
    private Member userid;
}
