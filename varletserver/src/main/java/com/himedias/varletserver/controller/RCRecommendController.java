package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.RCRcommend.RcrecommendWrite;
import com.himedias.varletserver.service.RCRecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

/**
 * 추천 댓글 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequestMapping("/rcrecommend")
public class RCRecommendController {

    @Autowired
    private RCRecommendService rcs;

    @PostMapping("/writeRecommend/{rnum}")
    public ResponseEntity<HashMap<String, Object>> writePost(@PathVariable("rnum") Integer rnum,
                                                             @Validated @RequestBody RcrecommendWrite rcrecommendWrite) {
        // PathVariable로 받은 rnum을 DTO에 설정
        rcrecommendWrite.setRnum(rnum);

        HashMap<String, Object> result = rcs.writeRecommend(rcrecommendWrite);
        return ResponseEntity.ok(result);
    }



}

