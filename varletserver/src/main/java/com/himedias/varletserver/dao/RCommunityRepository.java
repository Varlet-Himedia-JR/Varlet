package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.Rcommunity.RCommunityInfo;
import com.himedias.varletserver.dto.Rcommunity.RCommunityMyList;
import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RCommunityRepository extends JpaRepository<RCommunity, Integer> {

    @Query("SELECT COUNT(r) FROM RCommunity r WHERE r.location = :location AND r.location2 = :location2")
    int countByLocationAndLocation2(@Param("location") int location, @Param("location2") int location2);

    @Query("SELECT COUNT(r) FROM RCommunity r WHERE r.location = :location")
    int countByLocation(@Param("location") int location);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r ")
    Page<RCommunitySummary> findAllBy(Pageable pageable);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.location = :location")
    Page<RCommunitySummary> findByLocation(@Param("location") int location, Pageable pageable);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.location = :location AND r.location2 = :location2")
    Page<RCommunitySummary> findByLocationAndLocation2(@Param("location") int location, @Param("location2") int location2, Pageable pageable);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r ORDER BY r.rnum DESC")
    List<RCommunitySummary> findAllBy(Sort sort);

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.userid=:userid ORDER BY r.rnum DESC")
    List<RCommunity> findAllMy(@Param("userid")String userid);

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

    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked, " +
            "COALESCE(COUNT(rc), 0) AS replyCount " +
            "FROM RCommunity r LEFT JOIN Rcrecommend rc ON r.rnum = rc.rcnum " +
            "GROUP BY r.rnum " +
            "ORDER BY r.rnum DESC")
    List<RCommunitySummary> findAllWithReplyCount();

    // 사용자 ID로 게시물 목록을 찾기
    @Query("SELECT r FROM RCommunity r WHERE r.userid = :userid")
    List<RCommunityMyList> findByUserid(@Param("userid") Member userid);

    @Query("SELECT r FROM RCommunity r WHERE r.userid = :userid AND r.location = :location")
    List<RCommunityMyList> findByUseridAndLocation(@Param("userid") Member userid, @Param("location") Integer location);

    @Query("SELECT r FROM RCommunity r WHERE r.userid = :userid AND r.location = :location AND r.location2 = :location2")
    List<RCommunityMyList> findByUseridAndLocationAndLocation2(@Param("userid") Member userid, @Param("location") Integer location, @Param("location2") Integer location2);

    // RCommunityInfo 프로젝션을 반환하는 메서드 추가
    @Query("SELECT r.rnum AS rnum, r.location AS location, r.location2 AS location2, r.views AS views, r.title AS title, " +
            "r.content AS content, r.reward AS reward, r.picked AS picked, r.writedate AS writedate, " +
            "r.startdate AS startdate, r.enddate AS enddate, r.userid AS userid " +
            "FROM RCommunity r WHERE r.rnum = :rnum")
    RCommunityInfo findPostInfoById(@Param("rnum") int rnum);







}

