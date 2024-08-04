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

    // 특정 사용자 ID로 게시글 목록 조회
    @GetMapping("/{userid}")
    public List<RCommunityDto> getPostsByUserid(@PathVariable String userid) {
        return rcs.getPostsByUserid(userid);
    }

    // 모든 게시글 목록 조회
    @GetMapping
    public List<RCommunityDto> getAllPosts() {
        return rcs.getAllPosts();
    }

    // 게시글 생성
    @PostMapping
    public RCommunityDto createPost(@RequestBody RCommunityDto rCommunityDto) {
        return rcs.savePost(rCommunityDto);
    }

    // 게시글 삭제
    @DeleteMapping("/{rnum}")
    public void deletePost(@PathVariable int rnum) {
        rcs.deletePost(rnum);
    }
}
