package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "rcrecommend", schema = "varlet")
public class Rcrecommend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rcnum", nullable = false)
    private Integer rcnum;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "rnum", nullable = false)
    private RCommunity rnum;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userid", nullable = false)
    private Member userid;

    @Size(max = 2000)
    @NotNull
    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    @NotNull
    @ColumnDefault("'N'")
    @Column(name = "rpicked", nullable = false)
    private Character rpicked;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "writedate", nullable = false)
    private Instant writedate;

    @Size(max = 100)
    @Column(name = "image", length = 100)
    private String image;

    @Size(max = 200)
    @Column(name = "saveimages", length = 200)
    private String saveimages;

}