package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Reviewimg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewimgRepository extends JpaRepository<Reviewimg, Long> {

}
