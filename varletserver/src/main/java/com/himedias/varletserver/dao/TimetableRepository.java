package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TimetableRepository extends JpaRepository<Timetable, String> {

    @Query("SELECT t FROM Timetable t WHERE t.tname = :tname")
    Timetable findTimetableByTname(@Param("tname") String tname);

    List<Timetable> findByUserid(String userid);
}
