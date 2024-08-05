package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.RCommunityDto;
import com.himedias.varletserver.service.RCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping("/rcommunity")
public class RCommunityController {

    @Autowired
    private RCommunityService rcs;


    @GetMapping("/getPostList")
    public HashMap<String, Object> getPostList() {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("postlist");
        result.put("postlist", rcs.getPostList());
        return result;
    }

    @GetMapping("/writePost")
    public HashMap<String, Object> writePost(){
         HashMap<String, Object> result = new HashMap<>();
        System.out.println("result in?");
    }


}
