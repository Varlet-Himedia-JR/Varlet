package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Dayschedule;
import com.himedias.varletserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayscheduleRepository extends JpaRepository<Dayschedule, String> {

}
