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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rcommunity")
public class RCommunityController {

    @Autowired
    private RCommunityService rcs;

    /**
     * 게시물 목록을 조회합니다. 위치에 따라 필터링할 수 있으며, 페이징과 정렬이 가능합니다.
     * @param location 위치 (선택적 파라미터)
     * @param location2 세부 위치 (선택적 파라미터)
     * @param page 페이지 번호 (기본값: 1)
     * @param size 페이지당 게시물 수 (기본값: 10)
     * @return 게시물 목록과 페이징 정보가 포함된 맵
     */
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

    /**
     * 사용자의 게시물 목록을 조회합니다.
     * @param userid 사용자 ID
     * @return 사용자의 게시물 목록이 포함된 맵
     */
    @GetMapping("/getMyList")
    public HashMap<String, Object> getMyPosts(@AuthenticationPrincipal Member user) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            List<RCommunitySummary> posts = rcs.getPostsByUser(user);
            result.put("success", true);
            result.put("posts", posts);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "게시글을 불러오는 데 실패했습니다.");
        }
        return result;

    }


    /**
     * 새 게시물을 작성합니다.
     * @param rCommunityWrite 게시물 작성에 필요한 데이터
     * @return 작성된 게시물의 결과를 포함하는 응답
     */
    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(
            @RequestBody RCommunityWrite rCommunityWrite) {
        System.out.println("호출되긴함????================================================================================================");
        HashMap<String, Object> result = rcs.writePost(rCommunityWrite).getBody();
        return ResponseEntity.ok(result);
    }

    /**
     * 특정 게시물의 상세 정보를 조회합니다.
     * @param rnum 게시물 ID
     * @return 게시물 상세 정보가 포함된 맵
     */
    @GetMapping("/rCommunityView/{rnum}")
    public HashMap<String, Object> getPostDetail(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        RCommunityInfo post = rcs.getPostDetail(rnum);
        result.put("post", post);
        return result;
    }

    /**
     * 게시물을 업데이트합니다.
     * @param rnum 게시물 ID
     * @param rCommunityWrite 게시물 업데이트에 필요한 데이터
     * @return 업데이트 결과를 포함하는 응답
     */
    @PostMapping("/rCommunityUpdate/{rnum}")
    public ResponseEntity<HashMap<String, Object>> updateCommunityPost(
            @PathVariable("rnum") int rnum,
            @RequestBody RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = rcs.updatePost(rnum, rCommunityWrite);
        System.out.println("호출?");
        return ResponseEntity.ok(result);
    }

    /**
     * 특정 게시물을 삭제합니다.
     * @param rnum 게시물 ID
     * @return 삭제 결과를 포함하는 맵
     */
    @DeleteMapping("/rCommunityDelete/{rnum}")
    public HashMap<String, Object> deleteCommunityPost(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            return rcs.deleteRCommunity(rnum);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "게시글 삭제에 실패했습니다.");
        }
        return result;
    }

    /**
     * 게시물의 채택 상태를 업데이트합니다.
     * @param rnum 게시물 ID
     * @param body 상태 업데이트 정보 (채택 여부)
     * @return 업데이트 결과를 포함하는 응답
     */
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
