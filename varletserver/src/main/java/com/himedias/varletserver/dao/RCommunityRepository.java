package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.RCommunityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RCommunityRepository extends JpaRepository<RCommunityDto, Integer> {



}
