package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<Point, Integer> {
  }