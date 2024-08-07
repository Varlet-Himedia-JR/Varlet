package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.RCommunitySummary;
import com.himedias.varletserver.dto.RCommunityWrite;
import com.himedias.varletserver.service.RCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        List<RCommunitySummary> postList = rcs.getPostList();  // 메서드 호출
        result.put("postlist", postList);
        System.out.println("postlist: " + postList);
        return result;
    }

    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(@RequestBody RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = rcs.writePost(rCommunityWrite);
        return ResponseEntity.ok(result);
    }


}
