package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

}
