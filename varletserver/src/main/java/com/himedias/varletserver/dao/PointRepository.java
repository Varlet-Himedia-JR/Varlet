package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.PointDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 포인트 데이터를 관리하는 리포지토리 인터페이스
 */
@Repository
public interface PointRepository extends JpaRepository<PointDto, Integer> {
  // 사용자 ID로 포인트 찾기
  Optional<PointDto> findByUserid(String userid);
}


