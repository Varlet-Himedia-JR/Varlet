package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Contents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ContentsRepository extends JpaRepository<Contents, Integer> {

    // cname, location, location2 필드에서 검색어가 포함된 경우 반환
    @Query("SELECT c FROM Contents c WHERE " +
            "LOWER(c.cname) LIKE LOWER(CONCAT('%', :query, '%')) ")
    List<Contents> searchByMultipleFields(String query);

    @Query("SELECT c FROM Contents c ORDER BY c.cseq DESC LIMIT 5")
    List<Contents> getRecentContents();

    @Transactional
    @Modifying
    @Query("DELETE FROM Contents c WHERE c.cseq = :cseq")
    void deleteByTseq(@Param("cseq") int cseq);
}
