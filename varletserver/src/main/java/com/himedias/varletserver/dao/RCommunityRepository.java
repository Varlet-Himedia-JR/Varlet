package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCommunityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 커뮤니티 게시글 데이터를 관리하는 리포지토리 인터페이스
 */
@Repository
public interface RCommunityRepository extends JpaRepository<RCommunityDto, Integer> {
    List<RCommunityDto> findByUserid(String userid);
}
