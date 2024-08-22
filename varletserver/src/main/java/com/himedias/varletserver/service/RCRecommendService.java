package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.ImageRepository;
import com.himedias.varletserver.dto.RCRcommend.RcrecommendInfo;
import com.himedias.varletserver.entity.Image;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RCRecommendService {

    @Autowired
    private RcrecommendRepository rcr;
    @Autowired
    private RCommunityRepository rc;
    @Autowired
    private MemberRepository mr;
    @Autowired
    private ImageRepository ir;

    public RCommunity findRCommunityById(int rnum) {
        return rc.findById(rnum)
                .orElseThrow(() -> new IllegalArgumentException("Invalid RCommunity ID"));
    }

    public Member findMemberById(String userid) {
        return mr.findById(userid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID"));
    }

    @Transactional
    public Rcrecommend saveRcrecommend(Rcrecommend rcrecommend, List<String> fileNames) {
        Rcrecommend savedRcrecommend = rcr.save(rcrecommend);

        for (String fileName : fileNames) {
            Image image = new Image();
            image.setRcRecommend(savedRcrecommend);
            image.setImageName(fileName);
            image.setFilePath("/uploads/" + fileName); // 파일 경로를 설정합니다.
            image.setMember(savedRcrecommend.getUserid()); // 파일 업로드 시 사용자 정보 설정
            ir.save(image); // 기본 JPA save 메서드를 사용하여 저장
        }

        return savedRcrecommend;
    }

    public List<RcrecommendInfo> getRecommend(int rnum) {
        return rcr.findAllByRnum(rnum);
    }

    @Transactional
    public void deleteRcrecommend(int rcnum) {
        // 관련된 이미지들을 먼저 삭제
        List<Image> images = ir.findAllByRcRecommendRcnum(rcnum);
        for (Image image : images) {
            ir.delete(image);
        }

        // 댓글 삭제
        rcr.deleteById(rcnum);
    }

    @Transactional
    public boolean updateReplyPicked(int rcnum, char rpicked) {
        // 답글의 채택 상태 업데이트
        int updatedRows = rcr.updateReplyPicked(rcnum, rpicked);

        if (updatedRows > 0 && rpicked == 'Y') {
            // rpicked가 'Y'로 설정된 경우 보상을 지급

            // 답글 정보 조회
            Rcrecommend reply = rcr.findById(rcnum)
                    .orElseThrow(() -> new RuntimeException("Reply not found"));

            // 답글이 속한 게시글 조회
            RCommunity rCommunity = reply.getRnum();

            // 답글 작성자 조회
            Member replyAuthor = reply.getUserid();

            // 게시글의 보상(reward)을 답글 작성자에게 지급
            int reward = rCommunity.getReward();
            replyAuthor.setPoint(replyAuthor.getPoint() + reward);

            // 포인트 업데이트
            mr.save(replyAuthor);

            // 게시글의 보상을 0으로 설정 (보상이 한 번만 지급되도록)
            rCommunity.setReward(0);
            rc.save(rCommunity);

            return true;
        }
        return false;
    }
}
