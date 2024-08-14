package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.RCommunity;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.List;


@Service
public class RCommunityService {

    @Autowired
    private RCommunityRepository rcr;

    public List<RCommunitySummary> getAllPosts() {
        return rcr.findAllBy(Sort.by(Sort.Direction.DESC, "rnum"));
    }

    public List<RCommunitySummary> getPostListByLocation(int location) {
        return rcr.findByLocation(location, Sort.by(Sort.Direction.DESC, "rnum"));
    }

    public List<RCommunitySummary> getPostListByLocationAndLocation2(int location, int location2) {
        return rcr.findByLocationAndLocation2(location, location2, Sort.by(Sort.Direction.DESC, "rnum"));
    }

    public RCommunity getPostById(int rnum) {
        return rcr.findPostById(rnum);
    }

    @Transactional
    public HashMap<String, Object> writePost(RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();

        // RCommunity 객체 생성 및 필드 설정
        RCommunity post = new RCommunity();
        post.setTitle(rCommunityWrite.getTitle());
        post.setContent(rCommunityWrite.getContent());
        post.setLocation(rCommunityWrite.getLocation());
        post.setLocation2(rCommunityWrite.getLocation2());
        post.setReward(rCommunityWrite.getReward());
        post.setUserid(rCommunityWrite.getUserid());
        post.setStartdate(rCommunityWrite.getStartdate());
        post.setEnddate(rCommunityWrite.getEnddate());
        post.setViews(0);
        post.setPicked(rCommunityWrite.getPicked()); // picked 값 설정

        // 게시글 저장
        RCommunity savedPost = rcr.save(post);
        System.out.println("post??" + post);
        result.put("success", true);
        result.put("post", savedPost);
        return result;
    }

    public RCommunity getPostAndIncreaseViewCount(int rnum) {
        RCommunity post = rcr.findPostById(rnum);
        if (post != null) {
            post.setViews(post.getViews() + 1);
            rcr.save(post);  // 업데이트된 게시글 저장
        }
        return post;
    }

    @Transactional
    public HashMap<String, Object> updatePost(int rnum, RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();

        RCommunity post = rcr.findPostById(rnum);
        if (post == null) {
            result.put("success", false);
            result.put("message", "게시물을 찾을 수 없습니다.");
            return result;
        }

        post.setTitle(rCommunityWrite.getTitle());
        post.setContent(rCommunityWrite.getContent());
        post.setLocation(rCommunityWrite.getLocation());
        post.setLocation2(rCommunityWrite.getLocation2());
        post.setReward(rCommunityWrite.getReward());
        post.setStartdate(rCommunityWrite.getStartdate());
        post.setEnddate(rCommunityWrite.getEnddate());

        rcr.save(post);  // 수정된 게시글 저장

        result.put("success", true);
        result.put("post", post);
        return result;
    }

    public void deleteRCommunity(int rnum) {
        RCommunity rc = rcr.findById(rnum).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        rcr.delete(rc);
    }



}