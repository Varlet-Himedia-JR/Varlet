package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "rcrecommend", schema = "varlet")
public class Rcrecommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rcnum", nullable = false)
    private Integer rcnum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "rnum", nullable = false)
    private RCommunity rnum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userid", nullable = false)
    private Member userid;

    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    @ColumnDefault("'N'")
    @Column(name = "rpicked", nullable = false)
    private Character rpicked;

    @CreationTimestamp
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "writedate", nullable = false)
    private Timestamp writedate;

    @OneToMany(mappedBy = "rcRecommend", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    @Column
    private String berth;  // 숙소 이름 추가

    @Column
    private String tour;   // 관광지 이름 추가

    // 이미지 추가 메서드
    public void addImage(Image image) {
        this.images.add(image);
        image.setRcRecommend(this);
    }
}
