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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

        List<RCommunitySummary> postList = rcs.getPostList(location, location2, paging);

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
    public ResponseEntity<HashMap<String, Object>> getMyList(
            @RequestParam("userId") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        HashMap<String, Object> result = new HashMap<>();

        // Pageable 객체 생성 - 작성 날짜를 기준으로 내림차순 정렬 (DESC)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rnum"));

        // 서비스 메소드 호출
        Page<RCommunitySummary> postListPage = rcs.getPostsByUserId(userId, pageable);

        // 게시글이 없을 경우
        if (postListPage.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            // 게시글이 있는 경우
            result.put("postlist", postListPage.getContent()); // 실제 게시글 목록
            result.put("currentPage", postListPage.getNumber()); // 현재 페이지 번호
            result.put("totalItems", postListPage.getTotalElements()); // 전체 게시글 수
            result.put("totalPages", postListPage.getTotalPages()); // 전체 페이지 수

            return new ResponseEntity<>(result, HttpStatus.OK);
        }
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
