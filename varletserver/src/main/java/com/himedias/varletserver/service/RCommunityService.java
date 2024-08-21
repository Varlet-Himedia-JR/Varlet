package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.dto.Rcommunity.RCommunityInfo;
import com.himedias.varletserver.dto.Rcommunity.RCommunityMyList;
import com.himedias.varletserver.dto.Rcommunity.RCommunitySummary;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@Service
public class RCommunityService {

    @Autowired
    private RCommunityRepository rcr;

    @Autowired
    private RcrecommendRepository rcrr;

    @Autowired
    private MemberRepository mr;

    public List<RCommunitySummary> getAllPosts(Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findAllBy(pageable).getContent();
    }

    public List<RCommunitySummary> getPostListByLocation(int location, Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findByLocation(location, pageable).getContent();
    }

    public List<RCommunitySummary> getPostListByLocationAndLocation2(int location, int location2, Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findByLocationAndLocation2(location, location2, pageable).getContent();
    }

    public int getTotalPostCount(Integer location, Integer location2) {
        if (location != null && location2 != null) {
            return rcr.countByLocationAndLocation2(location, location2);
        } else if (location != null) {
            return rcr.countByLocation(location);
        } else {
            return (int) rcr.count();
        }
    }

    public RCommunity getPostById(int rnum) {
        return rcr.findPostById(rnum);
    }


    @Transactional
    public HashMap<String, Object> writePost(RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();

        // 유효한 사용자 ID인지 확인
        Optional<Member> memberOptional = mr.findByUserid(rCommunityWrite.getUserid());
        if (memberOptional.isEmpty()) {
            result.put("success", false);
            result.put("message", "유효하지 않은 사용자 ID입니다.");
            return result;
        }

        Member member = memberOptional.get();

        // RCommunity 객체 생성 및 필드 설정
        RCommunity post = new RCommunity();
        post.setTitle(rCommunityWrite.getTitle());
        post.setContent(rCommunityWrite.getContent());
        post.setLocation(rCommunityWrite.getLocation());
        post.setLocation2(rCommunityWrite.getLocation2());
        post.setReward(rCommunityWrite.getReward());
        post.setUserid(member);  // Member 엔티티 설정
        post.setStartdate(rCommunityWrite.getStartdate().toLocalDateTime());
        post.setEnddate(rCommunityWrite.getEnddate().toLocalDateTime());
        post.setViews(0);
        post.setPicked(rCommunityWrite.getPicked());

        // 게시글 저장
        RCommunity savedPost = rcr.save(post);

        result.put("success", true);
        result.put("post", savedPost);
        return result;
    }

    @Transactional
    public RCommunityInfo getPostDetail(int rnum) {
        RCommunity post = rcr.findPostById(rnum);

        if (post != null) {
            post.setViews(post.getViews() + 1);
            rcr.save(post);  // 업데이트된 게시글 저장
        }
        return rcr.findPostInfoById(rnum);
    }

    @Transactional
    public HashMap<String, Object> updatePost(int rnum, RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();

        // 게시글 찾기
        Optional<RCommunity> postOptional = rcr.findById(rnum);
        if (postOptional.isEmpty()) {
            result.put("success", false);
            result.put("message", "게시물을 찾을 수 없습니다.");
            return result;
        }

        RCommunity post = postOptional.get();

        // DTO에서 값을 가져와 게시글 업데이트
        post.setTitle(rCommunityWrite.getTitle());
        post.setContent(rCommunityWrite.getContent());
        post.setLocation(rCommunityWrite.getLocation());
        post.setLocation2(rCommunityWrite.getLocation2());
        post.setReward(rCommunityWrite.getReward());
        post.setPicked(rCommunityWrite.getPicked());

        // 날짜 변환
        post.setStartdate(rCommunityWrite.getStartdate().toLocalDateTime());
        post.setEnddate(rCommunityWrite.getEnddate().toLocalDateTime());

        // 사용자 ID 체크 (옵션: 필요한 경우)
        if (rCommunityWrite.getUserid() != null) {
            Optional<Member> memberOptional = mr.findByUserid(rCommunityWrite.getUserid());
            if (memberOptional.isEmpty()) {
                result.put("success", false);
                result.put("message", "유효하지 않은 사용자 ID입니다.");
                return result;
            }
            Member member = memberOptional.get();
            post.setUserid(member); // 유효한 사용자 ID로 설정
        }

        // 게시글 저장
        rcr.save(post);

        result.put("success", true);
        result.put("post", post);
        return result;
    }

    @Transactional
    public void deleteRCommunity(int rnum) {
        RCommunity rc = rcr.findById(rnum).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        rcr.delete(rc);
    }

    @Transactional
    public boolean updatePicked(String rnum, char picked) {
        int updatedRows = rcr.updatePicked(rnum, picked);
        return updatedRows > 0;
    }
    // Member 객체를 userid로 조회
    public Optional<Member> findMemberByUserid(String userid) {
        return mr.findByUserid(userid);
    }
    // 기존 메소드들
    public List<RCommunityMyList> getPostsByUserId(Member userid) {
        return rcr.findByUserid(userid);
    }

    public List<RCommunityMyList> getPostsByUserIdAndLocation(Member userid, Integer location) {
        return rcr.findByUseridAndLocation(userid, location);
    }

    public List<RCommunityMyList> getPostsByUserIdAndLocationAndLocation2(Member userid, Integer location, Integer location2) {
        return rcr.findByUseridAndLocationAndLocation2(userid, location, location2);
    }

//    public List<RCommunity> getMyAllPosts(String userid) {
//        return rcr.findAllMy(userid);
//
//    }

}