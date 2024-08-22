package com.himedias.varletserver.controller;


import com.himedias.varletserver.service.ReviewimgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ReviewimgController {

    @Autowired
    ReviewimgService res;
}
