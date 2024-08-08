package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.RCRecommend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RCRecommendRepository extends JpaRepository<RCRecommend, Integer> {
}
