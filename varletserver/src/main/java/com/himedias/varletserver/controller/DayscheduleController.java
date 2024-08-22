package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Dayschedule;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.service.DayscheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/dayschedule")
public class DayscheduleController {
    @Autowired
    DayscheduleService ds;

    @PostMapping("/insertDayschedule")
    public HashMap<String, Object> insertDayschedule(@RequestBody Dayschedule dayschedule){
        HashMap<String, Object> result = new HashMap<String, Object>();
        ds.insertDayschedule(dayschedule);
        result.put("msg","ok");
        return result;
    }

    @PostMapping("/deleteDayschedule/{dseq}")
    public HashMap<String, Object> deleteDayschedule(@PathVariable("dseq") String dseq){
        HashMap<String, Object> result = new HashMap<String, Object>();
        ds.deleteDayschedule(dseq);
        result.put("msg","ok");
        return result;
    }
}
