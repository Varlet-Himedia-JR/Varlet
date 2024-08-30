package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Reviewpreview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewPreviewRepository extends JpaRepository<Reviewpreview, Integer> {
    Page<Reviewpreview> findAllBy(Pageable pageable);
    @Query("SELECT r FROM Reviewpreview r WHERE LOWER(r.userid) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Reviewpreview> searchByMultipleFields(String query);
}
