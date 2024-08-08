package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Contents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentsRepository extends JpaRepository<Contents, Integer> {

}
