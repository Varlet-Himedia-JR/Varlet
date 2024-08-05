package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.PointLogDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 포인트 로그 데이터를 관리하는 리포지토리 인터페이스
 */
@Repository
public interface PointLogRepository extends JpaRepository<PointLogDto, Integer> {
}