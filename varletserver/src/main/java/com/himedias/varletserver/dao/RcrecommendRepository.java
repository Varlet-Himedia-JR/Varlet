package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCRcommend.RcrecommendInfo;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RcrecommendRepository extends JpaRepository<Rcrecommend, Integer> {

    /**
     * 특정 게시글 ID에 대한 답글을 최신 순서로 조회합니다.
     * @param rnum 게시글 ID
     * @return 답글 정보 리스트
     */
    @Query("SELECT r FROM Rcrecommend r LEFT JOIN FETCH r.images WHERE r.rnum.rnum = :rnum")
    Page<RcrecommendInfo> findByRnum(@Param("rnum") int rnum, Pageable pageable);

    /**
     * 특정 게시글 ID에 속하면서 주어진 답글 ID가 아닌 답글들을 조회합니다.
     * @param rnum 게시글 ID
     * @param rcnum 제외할 답글 ID
     * @return 답글 리스트
     */
    Page<RcrecommendInfo> findAllByRnum(@Param("rnum") Integer rnum, Pageable pageable);

    /**
     * 특정 답글의 채택 상태를 업데이트합니다.
     * @param rcnum 답글 ID
     * @param rpicked 채택 상태 ('Y' 또는 'N')
     * @return 업데이트된 행의 수
     */
    @Modifying
    @Query("UPDATE Rcrecommend r SET r.rpicked = :rpicked WHERE r.rcnum = :rcnum")
    int updateReplyPicked(@Param("rcnum") int rcnum, @Param("rpicked") char rpicked);
}
