package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RPostRepository extends JpaRepository<Post, Integer> {
}