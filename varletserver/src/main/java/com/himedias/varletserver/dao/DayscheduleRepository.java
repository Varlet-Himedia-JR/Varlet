package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Dayschedule;
import com.himedias.varletserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface DayscheduleRepository extends JpaRepository<Dayschedule, String> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Dayschedule d WHERE d.dseq = :dseq")
    void deleteDayschedule(@Param("dseq")int dseq);
}
