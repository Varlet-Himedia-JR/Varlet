package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.RCommunityDto;
import com.himedias.varletserver.service.RCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 커뮤니티 게시글 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequestMapping("/api/rcommunity")
public class RCommunityController {

    @Autowired
    private RCommunityService rcs;


    @GetMapping
    public List<RCommunityDto> getAllPosts() {
        return rcs.getAllPosts();
    }

}
