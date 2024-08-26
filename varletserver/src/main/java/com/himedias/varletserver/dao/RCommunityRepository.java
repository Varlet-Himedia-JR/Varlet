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

    // 레포지토리 레이어에서 댓글 수를 포함한 모든 게시물 목록을 페이징 처리하여 가져오는 쿼리
    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, " +
            "r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked, " +
            "COUNT(rc) AS replyCount " +
            "FROM RCommunity r LEFT JOIN Rcrecommend rc ON r.rnum = rc.rnum.rnum " +
            "GROUP BY r.rnum, r.userid, r.location, r.location2, r.writedate, r.views, r.title, r.reward, r.picked")
    Page<RCommunitySummary> findAllWithReplyCount(Pageable pageable);

    // location과 location2가 주어진 경우 해당 위치에 맞는 게시물 수를 반환하는 쿼리
    @Query("SELECT COUNT(r) FROM RCommunity r WHERE r.location = :location AND r.location2 = :location2")
    int countByLocationAndLocation2(@Param("location") int location, @Param("location2") int location2);

    // location이 주어진 경우 해당 위치에 맞는 게시물 수를 반환하는 쿼리
    @Query("SELECT COUNT(r) FROM RCommunity r WHERE r.location = :location")
    int countByLocation(@Param("location") int location);

    // 특정 location에 해당하는 페이징 처리된 게시물 목록을 반환하는 쿼리
    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.location = :location")
    Page<RCommunitySummary> findByLocation(@Param("location") int location, Pageable pageable);

    // 특정 location과 location2에 해당하는 페이징 처리된 게시물 목록을 반환하는 쿼리
    @Query("SELECT r.rnum AS rnum, r.userid AS userid, r.location AS location, r.location2 AS location2, r.writedate AS writedate, r.views AS views, r.title AS title, r.reward AS reward, r.picked AS picked " +
            "FROM RCommunity r WHERE r.location = :location AND r.location2 = :location2")
    Page<RCommunitySummary> findByLocationAndLocation2(@Param("location") int location, @Param("location2") int location2, Pageable pageable);

    // 게시글 ID(rnum)로 게시글을 조회합니다.
    @Query("SELECT r FROM RCommunity r WHERE r.rnum = :rnum")
    RCommunity findPostById(@Param("rnum") int rnum);

    // 데이터베이스에서 게시글의 picked 상태를 업데이트하는 쿼리 메소드
    @Modifying
    @Query("UPDATE RCommunity r SET r.picked = :picked WHERE r.rnum = :rnum")
    int updatePicked(
            // 게시글 ID와 새로운 picked 상태를 파라미터로 받아 쿼리에 사용
            @Param("rnum") String rnum,
            @Param("picked") char picked);

    // Pageable를 이용하여 사용자 ID로 게시글 조회 (최신 순으로 정렬)
    Page<RCommunityMyList> findByUserid(Member userid, Pageable pageable);


    // 게시글 ID로 RCommunityInfo 프로젝션을 반환합니다.
    @Query("SELECT r.rnum AS rnum, r.location AS location, r.location2 AS location2, r.views AS views, r.title AS title, " +
            "r.content AS content, r.reward AS reward, r.picked AS picked, r.writedate AS writedate, " +
            "r.startdate AS startdate, r.enddate AS enddate, r.userid AS userid " +
            "FROM RCommunity r WHERE r.rnum = :rnum")
    RCommunityInfo findPostInfoById(@Param("rnum") int rnum);



}
