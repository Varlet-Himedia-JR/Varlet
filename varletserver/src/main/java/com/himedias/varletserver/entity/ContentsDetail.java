package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentsDetail {

    @Id
    @Column(name = "cdseq", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cdseq;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "cseq", nullable = false, referencedColumnName = "cseq")
    private Contents contents;
    private String cnmae;

    private String userid;
    private String cname;
    private String ctype;
}