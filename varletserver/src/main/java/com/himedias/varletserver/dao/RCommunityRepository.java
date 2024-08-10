package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.Rcommunity.RCommunityDetail;
import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.entity.RCommunity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RCommunityRepository extends JpaRepository<RCommunity, Integer> {

    List<RCommunitySummary> findAllBy(Sort sort);

    List<RCommunitySummary> findByLocation(int location, Sort sort);

    List<RCommunitySummary> findByLocationAndLocation2(int location, String location2, Sort sort);
}
