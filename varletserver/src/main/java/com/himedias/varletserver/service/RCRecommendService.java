package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.ImageRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.dto.RCRcommend.RcrecommendInfo;
import com.himedias.varletserver.entity.Image;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@Service
public class RCRecommendService {

    @Autowired
    private RcrecommendRepository rcr; // 답글 관련 데이터베이스 작업을 위한 레포지토리
    @Autowired
    private RCommunityRepository rc; // 게시글 관련 데이터베이스 작업을 위한 레포지토리
    @Autowired
    private MemberRepository mr; // 사용자 관련 데이터베이스 작업을 위한 레포지토리
    @Autowired
    private ImageRepository ir; // 이미지 관련 데이터베이스 작업을 위한 레포지토리

    @Autowired
    private ImageService is;

    /**
     * 주어진 게시글 ID로 게시글을 조회합니다.
     * @param rnum 게시글 ID
     * @return RCommunity 객체
     * @throws IllegalArgumentException 게시글 ID가 유효하지 않은 경우
     */
    public RCommunity findRCommunityById(int rnum) {
        return rc.findById(rnum)
                .orElseThrow(() -> new IllegalArgumentException("Invalid RCommunity ID"));
    }

    /**
     * 주어진 사용자 ID로 사용자를 조회합니다.
     * @param userid 사용자 ID
     * @return Member 객체
     * @throws IllegalArgumentException 사용자 ID가 유효하지 않은 경우
     */
    public Member findMemberById(String userid) {
        return mr.findById(userid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID"));
    }

    /**
     * 새로운 답글을 저장하고 관련된 이미지 파일을 저장합니다.
     * @param rcrecommend 저장할 답글 객체
     * @param fileNames 이미지 파일명 목록
     * @return 저장된 Rcrecommend 객체
     */
// 답글과 관련된 파일을 저장하는 서비스 메소드
    @Transactional
    public Rcrecommend saveRcrecommend(Rcrecommend rcrecommend, MultipartFile[] files, HashMap<String, String> allParams, Member member) {
        // 답글을 데이터베이스에 저장
        Rcrecommend savedRcrecommend = rcr.save(rcrecommend);

        // 파일이 있을 경우 파일 저장 및 이미지 정보 저장
        if (files != null && files.length > 0) {
            is.saveFiles(files, member, rcrecommend, allParams); // 모든 매개변수 전달
        }

        return savedRcrecommend;
    }


    /**
     * 주어진 게시글 ID로 답글 목록을 조회합니다.
     * @param rcnum 게시글 ID
     * @return RcrecommendInfo 리스트
     */
//    public Page<RcrecommendInfo> getReplies(int rnum, Pageable pageable) {
//        return rcr.findRepliesByRnum(rnum, pageable);
//    }

    public Page<RcrecommendInfo> getRecommend(int rnum, Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findByRnum(rnum, pageable);
    }

    /**
     * 주어진 답글 ID로 답글을 삭제합니다.
     * 답글과 연관된 이미지들도 먼저 삭제합니다.
     * @param rcnum 답글 ID
     */
    @Transactional
    public void deleteRcrecommend(int rcnum) {
        // 답글과 관련된 이미지들을 먼저 삭제
        List<Image> images = ir.findAllByRcRecommendRcnum(rcnum);
        for (Image image : images) {
            ir.delete(image); // 이미지 삭제
        }

        // 답글 삭제
        rcr.deleteById(rcnum);
    }

    /**
     * 답글의 채택 상태를 업데이트하고 채택된 답글의 작성자에게 보상을 지급합니다.
     * @param rcnum 답글 ID
     * @param rpicked 답글의 채택 상태 ('Y' 또는 'N')
     * @return 채택 상태 업데이트 결과
     */
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

            return true; // 채택 및 보상 지급 성공
        }
        return false; // 채택 실패
    }

}
