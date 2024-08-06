package com.himedias.varletserver.controller;


import com.himedias.varletserver.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    CourseService cs;

    @GetMapping("/getTnames/{userid}")
    public HashMap<String,Object> getTnamesByUserid(@PathVariable String userid) {
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("mycourse",cs.getTnamesByUserid(userid));
        return result;
    }

    @GetMapping("/getDuration/{mycourse}")
    public HashMap<String,Object> getDuration(@PathVariable String mycourse) {
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("duration",cs.getDurationByTnames(mycourse));
        return result;
    }

}
