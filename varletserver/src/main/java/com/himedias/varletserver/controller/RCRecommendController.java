package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.RCRecommendDto;
import com.himedias.varletserver.service.RCRecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 추천 댓글 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequestMapping("/api/rcrecommend")
public class RCRecommendController {

    @Autowired
    private RCRecommendService rcRecommendService;

    @GetMapping("/{rnum}")
    public List<RCRecommendDto> getCommentsByRnum(@PathVariable int rnum) {
        return rcRecommendService.getCommentsByRnum(rnum);
    }

    @GetMapping
    public List<RCRecommendDto> getAllComments() {
        return rcRecommendService.getAllComments();
    }

    @PostMapping
    public RCRecommendDto createComment(@RequestBody RCRecommendDto rcRecommendDto) {
        return rcRecommendService.saveComment(rcRecommendDto);
    }

    @DeleteMapping("/{rcnum}")
    public void deleteComment(@PathVariable int rcnum) {
        rcRecommendService.deleteComment(rcnum);
    }
}
