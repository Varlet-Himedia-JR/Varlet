package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.CourseRepository;
import com.himedias.varletserver.entity.Dayschedule;
import com.himedias.varletserver.entity.Timetable;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    @Autowired
    CourseRepository cr;

    public List<String> getTnamesByUserid(String userid) {
        return cr.findTnamesByUserid(userid);
    }
    public List<Timetable> getMycourseByTseq(String tseq, String userid) {
        return cr.findMycourseByTseq(tseq,userid);
    }


    public List<String> getDurationByTseq(String tseq) {
        Optional<Timetable> tt = cr.findDurationByTseq(tseq);
        List<String> duration = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        if (tt.isPresent()) {
            Timetable timetable = tt.get();
            Calendar start = Calendar.getInstance();
            start.setTime(timetable.getStart_date());
            Calendar end = Calendar.getInstance();
            end.setTime(timetable.getEnd_date());

            while (!start.after(end)) {
                duration.add(sdf.format(start.getTime()));
                start.add(Calendar.DATE, 1);
            }
        }

        for (int i = 0; i < duration.size(); i++) {
            System.out.println(duration.get(i));
        }

        return duration;

    }

    public List<Dayschedule> getDaySchedules(String tseq, String userid) {
//        Timetable tt = cr.findTseqByTnamesAndUserid(tnames,userid);
//        int tseq = tt.getTseq();
        return cr.findDayschedule(tseq);

    }



}


