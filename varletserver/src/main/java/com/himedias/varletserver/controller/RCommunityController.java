package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.dto.Rcommunity.RCommunityInfo;
import com.himedias.varletserver.dto.Rcommunity.RCommunityMyList;
import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.service.RCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/rcommunity")
public class RCommunityController {

    @Autowired
    private RCommunityService rcs;

    public RCommunityController(RCommunityService rcs) {
        this.rcs = rcs;
    }

    @GetMapping("/getPostList")
    public HashMap<String, Object> getPostList(
            @RequestParam(required = false) Integer location,
            @RequestParam(required = false) Integer location2,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(size);
        paging.setSort(Sort.by(Sort.Direction.DESC, "rnum"));

        List<RCommunitySummary> postList;

        if (location != null && location2 != null) {
            postList = rcs.getPostListByLocationAndLocation2(location, location2, paging);
        } else if (location != null) {
            postList = rcs.getPostListByLocation(location, paging);
        } else {
            postList = rcs.getAllPosts(paging);
        }

        paging.setTotalCount(rcs.getTotalPostCount(location, location2)); // 총 게시물 수 설정
        paging.calPaging(); // 페이징 계산

        result.put("postlist", postList);
        result.put("paging", paging);
        return result;
    }

    @GetMapping("/getMyList/{userid}")
    public HashMap<String, Object> getMyList(@PathVariable("userid") String userid) {
        HashMap<String, Object> result = new HashMap<>();
//        result.put("postlist", rcs.getMyAllPosts(userid));
        return result; // 결과 반환
    }

    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(
            @RequestBody RCommunityWrite rCommunityWrite) {
        System.out.println("호출되긴함????================================================================================================");
        HashMap<String, Object> result = rcs.writePost(rCommunityWrite).getBody();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rCommunityView/{rnum}")
    public HashMap<String, Object> getPostDetail(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        RCommunityInfo post = rcs.getPostDetail(rnum);
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