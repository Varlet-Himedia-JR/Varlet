package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository extends JpaRepository<Timetable, String> {
}
