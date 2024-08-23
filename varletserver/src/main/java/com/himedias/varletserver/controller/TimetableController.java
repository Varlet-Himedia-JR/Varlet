package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Timetable;
import com.himedias.varletserver.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/timetable")
public class TimetableController {

    @Autowired
    TimetableService ts;

    @GetMapping("/getAllMyCourse/{userid}")
    public HashMap<String,Object> getAllMyCourse(@PathVariable String userid) {
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("mycourse",ts.getAllMyCourse(userid));
//        result.put("mycourse",cs.getAllMycourseByUserid(userid));
        return result;
    }

    @PostMapping("/insertTimetable")
    public HashMap<String, Object> insertTimetable(@RequestBody Timetable timetable){
        HashMap<String, Object> result = new HashMap<String, Object>();
        ts.insertTimetable(timetable);
        return result;
    }

    @PostMapping("/deleteTimetable/{tseq}")
    public HashMap<String, Object> deleteTimetable(@PathVariable String tseq){
        HashMap<String, Object> result = new HashMap<String, Object>();
        ts.deleteTimetable(tseq);
        result.put("msg","ok");
        return result;
    }

    @GetMapping("/getTseq/{selectedCourse}")
    public HashMap<String, Object> getTseq(@PathVariable String selectedCourse){
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("tseq",ts.getTseq(selectedCourse).getTseq());
        return result;
    }
}
