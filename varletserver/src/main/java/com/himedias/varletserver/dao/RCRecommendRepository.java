package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCRecommendDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RCRecommendRepository extends JpaRepository<RCRecommendDto, Integer> {
}
