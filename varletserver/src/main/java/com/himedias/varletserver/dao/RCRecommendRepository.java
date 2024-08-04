package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCRecommendDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 추천 댓글 데이터를 관리하는 리포지토리 인터페이스
 */
@Repository
public interface RCRecommendRepository extends JpaRepository<RCRecommendDto, Integer> {
    // 특정 게시글 번호의 댓글 목록 찾기
    List<RCRecommendDto> findByRnum(int rnum);
}
