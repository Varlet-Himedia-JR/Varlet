package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.service.RCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public HashMap<String, Object> getPostList(
            @RequestParam("location") int location,
            @RequestParam("location2") String location2) {

        HashMap<String, Object> result = new HashMap<>();
        List<RCommunitySummary> postList = rcs.getPostList(location, location2);
        result.put("postlist", postList);
        return result;
    }

    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(@RequestBody RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = rcs.writePost(rCommunityWrite);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rCommunityDetail/{rnum}")
    public HashMap<String, Object> getPostDetail(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        RCommunity post = rcs.getPostAndIncreaseViewCount(rnum);
        result.put("post", post);
        return result;
    }


}
