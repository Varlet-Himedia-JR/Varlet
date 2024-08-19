package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.service.RCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
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
            @RequestParam(required = false) Integer location,
            @RequestParam(required = false) Integer location2) {
        HashMap<String, Object> result = new HashMap<>();
        List<RCommunitySummary> postList;

        if (location != null && location2 != null) {
            postList = rcs.getPostListByLocationAndLocation2(location, location2);
        } else if (location != null) {
            postList = rcs.getPostListByLocation(location);
        } else {
            postList = rcs.getPostListWithReplyCount();  // 댓글 수를 포함한 전체 게시글 반환
        }

        result.put("postlist", postList);
        return result;
    }

    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(@RequestBody RCommunityWrite rCommunityWrite) {
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

    @GetMapping("/getMyList/{userid}")
    public HashMap<String, Object> getMyList(@PathVariable String userid,
                                             @RequestParam(required = false) Integer location,
                                             @RequestParam(required = false) Integer location2) {
        HashMap<String, Object> result = new HashMap<>();
        List<RCommunity> postList;

        if (location != null && location2 != null) {
            // 특정 지역과 하위 지역으로 게시물 필터링
            postList = rcs.getPostsByUserIdAndLocation(userid, location, location2);
        } else if (location != null) {
            // 특정 지역으로 게시물 필터링
            postList = rcs.getPostsByUserIdAndLocation(userid, location);
        } else {
            // 사용자의 모든 게시물 조회
            postList = rcs.getPostsByUserId(userid);
        }

        result.put("postlist", postList); // 'postlist'라는 키로 결과를 저장
        return result; // 결과 반환
    }



    @PostMapping("/updatePicked/{rnum}")
    public ResponseEntity<?> updatePicked(@PathVariable String rnum, @RequestBody HashMap<String, String> body) {
        String pickedStr = body.get("picked");
        if (pickedStr == null || (!pickedStr.equals("Y") && !pickedStr.equals("N"))) {
            return ResponseEntity.badRequest().body("Invalid picked value");
        }

        // String을 Character로 변환
        Character picked = pickedStr.charAt(0);

        boolean result = rcs.updatePicked(rnum, picked);
        if (result) {
            return ResponseEntity.ok().body("Picked updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update picked");
        }
    }


}