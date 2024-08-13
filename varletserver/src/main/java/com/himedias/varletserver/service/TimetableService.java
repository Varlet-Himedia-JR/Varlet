package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.TimetableRepository;
import com.himedias.varletserver.entity.Timetable;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TimetableService {
    @Autowired
    TimetableRepository tr;


    public void insertTimetable(Timetable timetable) {
//        System.out.println("ttinfo : "+timetable.toString());
        tr.save(timetable);
    }

    public Timetable getTseq(String selectedCourse) {
        return tr.findTimetableByTname(selectedCourse);
    }
}
