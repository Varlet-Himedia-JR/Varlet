package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Member, String> {

    @Query("SELECT t.tname FROM Timetable t WHERE t.userid = :userid")
    List<String> findTnamesByUserid(@Param("userid") String userid);


    @Query("SELECT t FROM Timetable t WHERE t.tname = :tname")
    Optional<Timetable> findDurationByTnames(@Param("tname") String tname);
}

