package com.himedias.varletserver.controller;

import com.himedias.varletserver.service.RPostService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rpost")
@Log4j2
public class RPostController {

    @Autowired
    RPostService rps;

}
