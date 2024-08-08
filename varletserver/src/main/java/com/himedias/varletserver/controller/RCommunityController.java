package com.himedias.varletserver.controller;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.RCommunityDetail;
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
        System.out.println("result: " + result);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/RCommunityDetail")
    public HashMap<String, Object> getRCommunityDetail(@RequestParam int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        RCommunity postdetail = rcs.getRCommunityDetail(rnum);
        result.put("postdetail", postdetail);
        return result;
    }


}
