package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.entity.RCommunity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RCommunityRepository extends JpaRepository<RCommunity, Integer> {

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r ORDER BY r.rnum DESC")
    List<RCommunitySummary> findAllBy(Sort sort);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.location = :location ORDER BY r.rnum DESC")
    List<RCommunitySummary> findByLocation(int location, Sort sort);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.location = :location AND r.location2 = :location2 ORDER BY r.rnum DESC")
    List<RCommunitySummary> findByLocationAndLocation2(int location, int location2, Sort sort);


    @Query("SELECT r FROM RCommunity r WHERE r.rnum = :rnum")
    RCommunity findPostById(@Param("rnum") int rnum);

    @Modifying
    @Query("UPDATE RCommunity r SET r.picked = :picked WHERE r.rnum = :rnum")
    int updatePicked(@Param("rnum") String rnum, @Param("picked") char picked);
    // 사용자 ID로 게시물 목록을 찾기
    List<RCommunity> findByUserid(String userid);

    List<RCommunity> findByUseridAndLocation(String userid, Integer location);

    List<RCommunity> findByUseridAndLocationAndLocation2(String userid, Integer location, Integer location2);
}
