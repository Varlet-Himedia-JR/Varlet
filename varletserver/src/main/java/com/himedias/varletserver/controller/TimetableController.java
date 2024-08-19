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

    @PostMapping("/inserTimetable")
    public HashMap<String, Object> join(@RequestBody Timetable timetable){
        HashMap<String, Object> result = new HashMap<String, Object>();
        ts.insertTimetable(timetable);
        return result;
    }

    @GetMapping("/getTseq/{selectedCourse}")
    public HashMap<String, Object> getTseq(@PathVariable String selectedCourse){
        HashMap<String,Object> result = new HashMap<String,Object>();
        result.put("tseq",ts.getTseq(selectedCourse).getTseq());
        return result;
    }
}
