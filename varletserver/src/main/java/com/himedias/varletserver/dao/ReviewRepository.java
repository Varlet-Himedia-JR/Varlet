package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.entity.ReviewSummary;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<ReviewSummary> findByUserid(String userid);

    Page<ReviewSummary> findAllBy(Pageable pageable);

    @Query("SELECT r FROM Review r WHERE LOWER(r.userid) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Review> searchByMultipleFields(String query);
}