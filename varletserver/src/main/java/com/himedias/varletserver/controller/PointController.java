package com.himedias.varletserver.controller;

import com.himedias.varletserver.service.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/point")
public class PointController {

    @Autowired
    PointService ps;

}
