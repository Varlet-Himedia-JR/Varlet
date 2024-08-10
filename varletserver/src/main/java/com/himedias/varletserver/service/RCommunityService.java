package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.RCommunity;
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

    public List<RCommunitySummary> getPostList(int location, String location2) {
        Sort sort = Sort.by(Sort.Direction.DESC, "rnum");

        if (location == 1) {
            // 전체 지역 선택 시
            return rcr.findAllBy(sort);
        } else if (location2 == null || location2.equals("") || location2.equals("전체")) {
            // 지역 2가 선택되지 않았거나 "전체"일 때
            return rcr.findByLocation(location, sort);
        } else {
            // 지역 1과 지역 2 모두 선택된 경우
            return rcr.findByLocationAndLocation2(location, location2, sort);
        }
    }




    @Transactional
    public HashMap<String, Object> writePost(@RequestBody RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            RCommunity rc = new RCommunity();
            rc.setUserid(rCommunityWrite.getUserid());
            rc.setLocation(rCommunityWrite.getLocation());
            rc.setLocation2(rCommunityWrite.getLocation2());
            rc.setReward(rCommunityWrite.getReward());
            rc.setTitle(rCommunityWrite.getTitle());
            rc.setContent(rCommunityWrite.getContent());
            rc.setPicked('N'); // 기본값
            rc.setViews(0); // 기본값

            System.out.println("rc?" + rc);
            // 게시글 저장
            rcr.save(rc);

            // 성공 응답
            result.put("success", true);
            result.put("message", "게시글이 성공적으로 작성되었습니다.");
        } catch (Exception e) {
            // 실패 응답
            result.put("success", false);
            result.put("message", "게시글 작성에 실패했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("rc?" + result);
        return result;
    }

    @Transactional
    public RCommunity getPostAndIncreaseViewCount(int rnum) {
        RCommunity post = rcr.findById(rnum)
                .orElseThrow(() -> new RuntimeException("Post not found with id " + rnum));
        post.setViews(post.getViews() + 1);
        rcr.save(post);
        return post;
    }


}
