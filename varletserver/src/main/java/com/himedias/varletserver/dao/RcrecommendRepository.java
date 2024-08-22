package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCRcommend.RcrecommendInfo;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RcrecommendRepository extends JpaRepository<Rcrecommend, Integer> {
    @Query("SELECT r FROM Rcrecommend r WHERE r.rnum.rnum = :rnum ORDER BY r.writedate DESC")
    List<RcrecommendInfo> findAllByRnum(@Param("rnum") Integer rnum);

    @Query("SELECT r FROM Rcrecommend r WHERE r.rnum = :rnum AND r.rcnum <> :rcnum")
    List<Rcrecommend> findByRnumAndNotRcnum(@Param("rnum") int rnum, @Param("rcnum") int rcnum);

    @Modifying
    @Query("UPDATE Rcrecommend r SET r.rpicked = :rpicked WHERE r.rcnum = :rcnum")
    int updateReplyPicked(@Param("rcnum") int rcnum, @Param("rpicked") char rpicked);
}