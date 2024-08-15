package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.entity.Image;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
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
    private ImageService ir;

    public RCommunity findRCommunityById(int rnum) {
        return rc.findById(rnum)
                .orElseThrow(() -> new IllegalArgumentException("Invalid RCommunity ID"));
    }

    public Member findMemberById(String userid) {
        return mr.findById(String.valueOf(userid))
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID"));
    }

    @Transactional
    public Rcrecommend saveRcrecommend(Rcrecommend rcrecommend, List<String> fileNames) {
        Rcrecommend savedRcrecommend = rcr.save(rcrecommend);

        for (String fileName : fileNames) {
            Image image = new Image();
            image.setRcRecommend(savedRcrecommend);
            image.setImageName(fileName);
            image.setFilePath("/uploads/RcommunityImages/" + fileName);
            image.setMember(savedRcrecommend.getUserid()); // 파일 업로드 시 사용자 정보 설정
            ir.saveImage(image);
        }

        return savedRcrecommend;
    }
}
