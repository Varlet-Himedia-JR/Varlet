package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.dto.Rcommunity.RcrecommendWrite;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;

/**
 * 추천 댓글 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class RCRecommendService {

    private  RcrecommendRepository rcrecommendRepository;
    private  RCommunityRepository rCommunityRepository;
    private  MemberRepository memberRepository;

    public void RcrecommendService(RcrecommendRepository rcrecommendRepository,
                                   RCommunityRepository rCommunityRepository,
                                   MemberRepository memberRepository) {
        this.rcrecommendRepository = rcrecommendRepository;
        this.rCommunityRepository = rCommunityRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public HashMap<String, Object> writeRecommend(RcrecommendWrite rcrecommendWrite) {
        HashMap<String, Object> result = new HashMap<>();

        Rcrecommend rcrecommend = new Rcrecommend();

        // RCommunity와 Member 엔티티를 찾아서 설정
        RCommunity rCommunity = rCommunityRepository.findById(rcrecommendWrite.getRnum())
                .orElseThrow(() -> new IllegalArgumentException("Invalid RCommunity ID"));
        Member member = memberRepository.findById(rcrecommendWrite.getUserid())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID"));

        rcrecommend.setRnum(rCommunity);
        rcrecommend.setUserid(member);
        rcrecommend.setContent(rcrecommendWrite.getContent());
        rcrecommend.setRpicked('N'); // 기본값 설정
        rcrecommend.setWritedate(Instant.now());
        rcrecommend.setImage(rcrecommendWrite.getImage());
        rcrecommend.setSaveimages(rcrecommendWrite.getSaveimages());

        // 엔티티 저장
        rcrecommendRepository.save(rcrecommend);

        result.put("success", true);
        result.put("message", "Recommendation written successfully");
        return result;
    }
}
