package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.RCommunityDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 커뮤니티 게시글 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class RCommunityService {

    @Autowired
    private RCommunityRepository rcr;

    public List<RCommunityDto> getPostsByUserid(String userid) {
        return rcr.findByUserid(userid);
    }

    public List<RCommunityDto> getAllPosts() {
        return rcr.findAll();
    }

    public RCommunityDto savePost(RCommunityDto rCommunityDto) {
        return rcr.save(rCommunityDto);
    }

    public void deletePost(int rnum) {
        rcr.deleteById(rnum);
    }
}
