package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.service.RCRecommendService;
import com.himedias.varletserver.service.RCommunityService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
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
            @RequestParam(required = false) Integer location,
            @RequestParam(required = false) Integer location2) {
        HashMap<String, Object> result = new HashMap<>();
        List<RCommunitySummary> postList;

        if (location != null && location2 != null) {
            postList = rcs.getPostListByLocationAndLocation2(location, location2);
        } else if (location != null) {
            postList = rcs.getPostListByLocation(location);
        } else {
            postList = rcs.getAllPosts();  // 필터링하지 않고 전체 게시글 반환
        }

        result.put("postlist", postList);
        return result;
    }

    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(@RequestBody RCommunityWrite rCommunityWrite) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String userId = authentication.getName();  // 로그인한 사용자의 ID
//        System.out.println(userId);
//        rCommunityWrite.setUserid(userId);  // 로그인한 사용자의 ID를 DTO에 설정

        HashMap<String, Object> result = rcs.writePost(rCommunityWrite);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rCommunityView/{rnum}")
    public HashMap<String, Object> getPostDetail(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        RCommunity post = rcs.getPostAndIncreaseViewCount(rnum);
        result.put("post", post);
        return result;
    }

    @PostMapping("/rCommunityUpdate/{rnum}")
    public ResponseEntity<HashMap<String, Object>> updateCommunityPost(
            @PathVariable("rnum") int rnum,
            @RequestBody RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = rcs.updatePost(rnum, rCommunityWrite);
        System.out.println("호출?");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/rCommunityDelete/{rnum}")
    public HashMap<String, Object> deleteCommunityPost(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            rcs.deleteRCommunity(rnum);
            result.put("status", "success");
            result.put("message", "게시글이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "게시글 삭제에 실패했습니다.");
        }
        return result;
    }

//    @GetMapping("/getMyList")


    @PostMapping("/pick")
    public String pickRecommendation(@RequestParam int rnum, @RequestParam Integer rcnum) {
        try {
            rcs.pickRecommendation(rnum, rcnum);
            return "채택 완료되었습니다.";
        } catch (RuntimeException e) {
            return "오류 발생: " + e.getMessage();
        }
    }

}