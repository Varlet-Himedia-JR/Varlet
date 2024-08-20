package com.himedias.varletserver.controller;


import com.himedias.varletserver.entity.Timetable;
import com.himedias.varletserver.service.CourseService;
import com.himedias.varletserver.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    CourseService cs;



    @GetMapping("/getTnames/{userid}")
    public HashMap<String,Object> getTnamesByUserid(@PathVariable String userid) {
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("mycourse",cs.getTnamesByUserid(userid));
//        result.put("mycourse",cs.getAllMycourseByUserid(userid));
        return result;
    }



    @GetMapping("/getDuration/{mycourse}")
    public HashMap<String,Object> getDuration(@PathVariable String mycourse) {
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("duration",cs.getDurationByTnames(mycourse));
        return result;
    }

    @GetMapping("/getMycourse/{mycourse}/{userid}")
    public HashMap<String,Object> getMycourse(@PathVariable String mycourse,@PathVariable String userid) {
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("duration",cs.getDurationByTnames(mycourse));
        result.put("dayschedule",cs.getDaySchedules(mycourse, userid));
        return result;
    }





}
