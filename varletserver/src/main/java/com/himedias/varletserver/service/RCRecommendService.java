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

}
