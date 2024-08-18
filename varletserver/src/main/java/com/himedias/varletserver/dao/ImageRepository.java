package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findAllByRcRecommendRcnum(int rcnum);
}