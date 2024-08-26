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
// REST 컨트롤러에서 "/getPostList"로 매핑된 GET 요청을 처리하는 메소드
    @GetMapping("/getPostList")
    public HashMap<String, Object> getPostList(
            // 클라이언트가 요청 시 전달할 수 있는 선택적 파라미터, location과 location2
            @RequestParam(required = false) Integer location,
            @RequestParam(required = false) Integer location2,
            // 페이지 번호와 페이지 크기를 설정하는 파라미터, 기본값은 각각 1과 10
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        // 결과를 저장할 HashMap 객체 생성
        HashMap<String, Object> result = new HashMap<>();

        // 페이징 정보를 담을 Paging 객체 생성
        Paging paging = new Paging();
        paging.setPage(page); // 요청된 페이지 번호 설정
        paging.setDisplayRow(size); // 페이지당 표시할 항목 수 설정
        paging.setSort(Sort.by(Sort.Direction.DESC, "rnum")); // rnum 필드를 기준으로 내림차순 정렬 설정

        // 서비스 레이어의 getPostList 메소드를 호출하여 게시물 목록을 가져옴
        List<RCommunitySummary> postList = rcs.getPostList(location, location2, paging);

        // 총 게시물 수를 서비스 레이어의 getTotalPostCount 메소드를 통해 가져와 페이징 객체에 설정
        paging.setTotalCount(rcs.getTotalPostCount(location, location2)); // 총 게시물 수 설정
        paging.calPaging(); // 페이징 정보를 계산

        // 결과 HashMap에 게시물 목록과 페이징 정보를 담음
        result.put("postlist", postList);
        result.put("paging", paging);

        // 결과를 클라이언트에게 반환
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
        Page<RCommunityMyList> postListPage = rcs.getPostsByUserId(userId, pageable);

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
// REST 컨트롤러에서 "/writePost"로 매핑된 POST 요청을 처리하는 메소드
    @PostMapping("/writePost")
    public ResponseEntity<HashMap<String, Object>> writePost(
            // 클라이언트로부터 JSON 형태로 전달된 게시글 데이터를 RCommunityWrite 객체로 매핑하여 받음
            @RequestBody RCommunityWrite rCommunityWrite) {

        // 메소드 호출 확인용 로그 출력
        System.out.println("호출되긴함????================================================================================================");

        // 서비스 레이어의 writePost 메소드를 호출하여 게시글 작성 로직을 처리하고 결과를 HashMap으로 받음
        HashMap<String, Object> result = rcs.writePost(rCommunityWrite).getBody();

        // 처리 결과를 HTTP 200 OK 상태와 함께 클라이언트에게 반환
        return ResponseEntity.ok(result);
    }

    /**
     * 특정 게시물의 상세 정보를 조회합니다.
     * @param rnum 게시물 ID
     * @return 게시물 상세 정보가 포함된 맵
     */
// REST 컨트롤러에서 "/rCommunityView/{rnum}"로 매핑된 GET 요청을 처리하는 메소드
    @GetMapping("/rCommunityView/{rnum}")
    public HashMap<String, Object> getPostDetail(@PathVariable("rnum") int rnum) {
        // 결과를 저장할 HashMap 객체 생성
        HashMap<String, Object> result = new HashMap<>();

        // 서비스 레이어의 getPostDetail 메소드를 호출하여 특정 게시글의 상세 정보를 가져옴
        RCommunityInfo post = rcs.getPostDetail(rnum);

        // 가져온 게시글 정보를 결과에 추가
        result.put("post", post);

        // 결과를 클라이언트에게 반환
        return result;
    }

    /**
     * 게시물을 업데이트합니다.
     * @param rnum 게시물 ID
     * @param rCommunityWrite 게시물 업데이트에 필요한 데이터
     * @return 업데이트 결과를 포함하는 응답
     */
// REST 컨트롤러에서 "/rCommunityUpdate/{rnum}"로 매핑된 POST 요청을 처리하는 메소드
    @PostMapping("/rCommunityUpdate/{rnum}")
    public ResponseEntity<HashMap<String, Object>> updateCommunityPost(
            // 경로 변수로 게시글 ID(rnum)를 받음
            @PathVariable("rnum") int rnum,
            // 클라이언트로부터 전달된 게시글 업데이트 데이터를 RCommunityWrite 객체로 받음
            @RequestBody RCommunityWrite rCommunityWrite) {

        // 서비스 레이어의 updatePost 메소드를 호출하여 게시글 업데이트 로직을 처리하고 결과를 HashMap으로 받음
        HashMap<String, Object> result = rcs.updatePost(rnum, rCommunityWrite);

        // 호출 확인용 로그 출력
        System.out.println("호출?");

        // 처리 결과를 HTTP 200 OK 상태와 함께 클라이언트에게 반환
        return ResponseEntity.ok(result);
    }

    /**
     * 특정 게시물을 삭제합니다.
     * @param rnum 게시물 ID
     * @return 삭제 결과를 포함하는 맵
     */
// REST 컨트롤러에서 "/rCommunityDelete/{rnum}"로 매핑된 DELETE 요청을 처리하는 메소드
    @DeleteMapping("/rCommunityDelete/{rnum}")
    public HashMap<String, Object> deleteCommunityPost(@PathVariable("rnum") int rnum) {
        // 결과를 저장할 HashMap 객체 생성
        HashMap<String, Object> result = new HashMap<>();

        try {
            // 서비스 레이어의 deleteRCommunity 메소드를 호출하여 게시글 삭제 로직을 처리하고 결과를 반환
            return rcs.deleteRCommunity(rnum);
        } catch (Exception e) {
            // 예외 발생 시, 에러 상태와 메시지를 결과 HashMap에 설정
            result.put("status", "error");
            result.put("message", "게시글 삭제에 실패했습니다.");
        }

        // 예외가 발생한 경우, 결과 HashMap을 반환
        return result;
    }

    /**
     * 게시물의 채택 상태를 업데이트합니다.
     * @param rnum 게시물 ID
     * @param body 상태 업데이트 정보 (채택 여부)
     * @return 업데이트 결과를 포함하는 응답
     */
// REST 컨트롤러에서 "/updatePicked/{rnum}"로 매핑된 POST 요청을 처리하는 메소드
    @PostMapping("/updatePicked/{rnum}")
    public ResponseEntity<?> updatePicked(
            // 경로 변수로 게시글 ID(rnum)를 받음
            @PathVariable String rnum,
            // 클라이언트로부터 전달된 JSON 데이터를 HashMap으로 받음
            @RequestBody HashMap<String, String> body) {

        // 요청 본문에서 'picked' 값을 가져옴
        String pickedStr = body.get("picked");

        // 'picked' 값이 null이거나 'Y' 또는 'N'이 아닌 경우, 잘못된 요청으로 간주하고 400 Bad Request 응답 반환
        if (pickedStr == null || (!pickedStr.equals("Y") && !pickedStr.equals("N"))) {
            return ResponseEntity.badRequest().body("Invalid picked value");
        }

        // String 값을 Character로 변환 ('Y' 또는 'N' 값)
        Character picked = pickedStr.charAt(0);

        // 서비스 레이어의 updatePicked 메소드를 호출하여 picked 상태를 업데이트
        boolean result = rcs.updatePicked(rnum, picked);

        // 업데이트가 성공한 경우, 200 OK 응답 반환
        if (result) {
            return ResponseEntity.ok().body("Picked updated successfully");
        } else {
            // 업데이트가 실패한 경우, 500 Internal Server Error 응답 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update picked");
        }
    }
}
