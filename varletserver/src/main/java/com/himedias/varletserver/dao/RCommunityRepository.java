package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCommunitySummary;
import com.himedias.varletserver.entity.RCommunity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RCommunityRepository extends JpaRepository<RCommunity, Integer> {

    List<RCommunitySummary> findAllBy(Sort sort);

}
