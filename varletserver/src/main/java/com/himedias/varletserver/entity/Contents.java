package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contents {

    @Id
    @Column(name = "cseq", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cseq;
    private int tseq;
    private int cdseq;
    private String userid;
    @Column(name = "cname", length = 50)
    private String cname;
    private String ctype;

    @OneToMany(mappedBy = "contents", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContentsDetail> contentsDetails;
}