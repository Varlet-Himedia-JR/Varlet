package com.himedias.varletserver.controller;

import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.dto.RCRcommend.RcrecommendInfo;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import com.himedias.varletserver.service.RCRecommendService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/rcrecommend")
public class RCRecommendController {

    @Autowired
    private RCRecommendService rcs;

    @Autowired
    private RcrecommendRepository rcr;


    @Autowired
    private ServletContext servletContext;


    /**
     * 새로운 답글을 작성하는 엔드포인트입니다.
     * 게시글 ID와 사용자 ID, 내용을 받아 해당 게시글에 답글을 추가합니다.
     * 선택적으로 이미지 파일 경로도 받을 수 있습니다.
     */
    @PostMapping("/writeRecommend/{rnum}")
    public HashMap<String, Object> writeRecommend(
            @PathVariable("rnum") int rnum,
            @RequestParam("userid") String userid,
            @RequestParam("content") String content,
            @RequestParam(value = "berth", required = false) String berth,
            @RequestParam(value = "tour", required = false) String tour,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam Map<String, String> allParams) {

        try {
            // 게시글 및 사용자 정보를 조회
            RCommunity rc = rcs.findRCommunityById(rnum);
            Member member = rcs.findMemberById(userid);

            // 새로운 답글 엔티티를 생성하고 필드 설정
            Rcrecommend rcrecommend = new Rcrecommend();
            rcrecommend.setContent(content);
            rcrecommend.setRnum(rc);
            rcrecommend.setUserid(member);
            rcrecommend.setBerth(berth);
            rcrecommend.setTour(tour);

            // 답글을 저장하고 파일이 있을 경우 파일 경로도 함께 저장
            Rcrecommend savedRcrecommend = rcs.saveRcrecommend(rcrecommend, files, (HashMap<String, String>) allParams, member);

            // HashMap으로 응답 구성
            HashMap<String, Object> response = new HashMap<>();
            response.put("rcnum", savedRcrecommend.getRcnum());
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Server Error", e);
        }
    }




    /**
     * 특정 게시글에 대한 답글 목록을 조회하는 엔드포인트입니다.
     * 게시글 ID를 받아 해당 게시글에 달린 모든 답글을 반환합니다.
     */
    @GetMapping("/getReplies/{rnum}")
    public HashMap<String, Object> rcrommendView(@PathVariable("rnum") int rnum,
                                                 @RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "5") int size) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(size);
        paging.setSort(Sort.by(Sort.Direction.DESC, "rcnum"));

        Page<RcrecommendInfo> recommendList = rcs.getRecommend(rnum, paging);

        paging.setTotalCount((int) recommendList.getTotalElements());
        paging.calPaging();

        // 절대 경로 변환 제거
        result.put("recommend", recommendList.getContent());
        result.put("paging", paging);
        return result;
    }



    /**
     * 특정 답글을 삭제하는 엔드포인트입니다.
     * 답글 ID를 받아 해당 답글을 삭제합니다.
     */
    @DeleteMapping("/deleteReply/{rcnum}")
    public ResponseEntity<String> deleteRecommend(@PathVariable("rcnum") int rcnum) {
        try {
            rcs.deleteRcrecommend(rcnum); // 답글 삭제
            return ResponseEntity.ok("Reply deleted successfully"); // 성공 메시지 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reply not found or could not be deleted");
        }
    }

    /**
     * 답글의 채택 상태를 업데이트하는 엔드포인트입니다.
     * 답글 ID와 채택 상태를 받아 답글의 채택 여부를 업데이트하고, 채택 시 포인트를 지급합니다.
     */
    @PostMapping("/updateReplyPicked/{rcnum}")
    public ResponseEntity<?> updateReplyPicked(@PathVariable int rcnum, @RequestBody HashMap<String, String> body) {
        String rpickedStr = body.get("rpicked");
        if (rpickedStr == null || (!rpickedStr.equals("Y") && !rpickedStr.equals("N"))) {
            return ResponseEntity.badRequest().body("Invalid rpicked value"); // 유효하지 않은 값에 대한 에러 응답
        }

        // String을 Character로 변환
        char rpicked = rpickedStr.charAt(0);

        // 답글의 채택 상태 업데이트 및 포인트 지급 로직 실행
        boolean result = rcs.updateReplyPicked(rcnum, rpicked);
        if (result) {
            return ResponseEntity.ok().body("Reply picked updated and reward granted successfully"); // 성공 응답
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update reply picked"); // 실패 응답
        }
    }
}

