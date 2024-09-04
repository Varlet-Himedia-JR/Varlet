package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import java.sql.Timestamp;
import java.time.Instant;

@Data
@Entity
@Builder
@AllArgsConstructor
public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pseq;

    @Column(name = "merchant_uid", nullable = false)
    private String merchantUid;

    @Column(name = "buyer_email", nullable = false)
    private String buyerEmail;

    @Column(name = "buyer_name", nullable = false)
    private String buyerName;

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "imp_uid", nullable = false)
    private String impUid;

    @Column(name = "indate")
    @ColumnDefault("CURRENT_TIMESTAMP")
    private Timestamp indate;

    @Column(name = "userid") // 추가
    private String userid;

    public Payments() {

    }


    @PrePersist
    public void prePersist() {
        if (indate == null) {
            indate = Timestamp.from(Instant.now());
        }
    }
}
