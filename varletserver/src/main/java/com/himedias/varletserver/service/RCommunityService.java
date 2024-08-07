package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.RCommunitySummary;
import com.himedias.varletserver.dto.RCommunityWrite;
import com.himedias.varletserver.entity.RCommunity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;


@Service
public class RCommunityService {

    @Autowired
    private RCommunityRepository rcr;

        public List<RCommunitySummary> getPostList() {
            return rcr.findAllBy(Sort.by(Sort.Direction.DESC, "rnum"));
        }


    public HashMap<String, Object> writePost(RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            RCommunity rCommunity = new RCommunity();
            rCommunity.setUserid(rCommunityWrite.getUserid());
            rCommunity.setLocation(rCommunityWrite.getLocation());
            rCommunity.setLocation2(rCommunityWrite.getLocation2());
            rCommunity.setReward(rCommunityWrite.getReward());
            rCommunity.setTitle(rCommunityWrite.getTitle());
            rCommunity.setContent(rCommunityWrite.getContent());
            rCommunity.setPicked('N'); // 기본값
            rCommunity.setSuggest(0); // 기본값
            rCommunity.setViews(0); // 기본값

            // 게시글 저장
            rcr.save(rCommunity);

            // 성공 응답
            result.put("success", true);
            result.put("message", "게시글이 성공적으로 작성되었습니다.");
        } catch (Exception e) {
            // 실패 응답
            result.put("success", false);
            result.put("message", "게시글 작성에 실패했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

}
