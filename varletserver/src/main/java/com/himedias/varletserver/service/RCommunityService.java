package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dao.RcrecommendRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.dto.Rcommunity.*;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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

    /**
     * 모든 게시물을 조회합니다.
     * @param paging 페이징 및 정렬 정보
     * @return 게시물 목록
     */
    public List<RCommunitySummary> getAllPosts(Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findAllBy(pageable).getContent();
    }

    /**
     * 특정 위치에 따른 게시물 목록을 조회합니다.
     * @param location 위치 정보
     * @param paging 페이징 및 정렬 정보
     * @return 위치에 따른 게시물 목록
     */
    public List<RCommunitySummary> getPostListByLocation(int location, Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findByLocation(location, pageable).getContent();
    }

    /**
     * 두 개의 위치 정보를 기준으로 게시물 목록을 조회합니다.
     * @param location 첫 번째 위치 정보
     * @param location2 두 번째 위치 정보
     * @param paging 페이징 및 정렬 정보
     * @return 두 위치 정보에 따른 게시물 목록
     */
    public List<RCommunitySummary> getPostListByLocationAndLocation2(int location, int location2, Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());
        return rcr.findByLocationAndLocation2(location, location2, pageable).getContent();
    }

    /**
     * 총 게시물 수를 계산합니다.
     * @param location 위치 정보 (선택적)
     * @param location2 두 번째 위치 정보 (선택적)
     * @return 게시물 총 수
     */
    public List<RCommunitySummary> getPostList(Integer location, Integer location2, Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());

        if (location != null && location2 != null) {
            return rcr.findByLocationAndLocation2(location, location2, pageable).getContent();
        } else if (location != null) {
            return rcr.findByLocation(location, pageable).getContent();
        } else {
            return rcr.findAllWithReplyCount(pageable).getContent();
        }
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

    /**
     * 게시물 ID로 게시물 정보를 조회합니다.
     * @param rnum 게시물 ID
     * @return 게시물 객체
     */
    public RCommunity getPostById(int rnum) {
        return rcr.findPostById(rnum);
    }

    /**
     * 새 게시물을 작성합니다.
     * @param rCommunityWrite 게시물 작성 정보
     * @return 게시물 작성 결과와 정보
     */
    @Transactional
    public ResponseEntity<HashMap<String, Object>> writePost(RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();

        // 유효한 사용자 ID인지 확인
        Optional<Member> memberOptional = mr.findById(rCommunityWrite.getUserid());
        if (memberOptional.isEmpty()) {
            result.put("success", false);
            result.put("message", "유효하지 않은 사용자 ID입니다.");
            return ResponseEntity.badRequest().body(result);
        }

        Member member = memberOptional.get();

        // 포인트 비교 로직
        if (rCommunityWrite.getReward() > member.getPoint()) {
            result.put("success", false);
            result.put("message", "의뢰금은 보유 포인트를 초과할 수 없습니다.");
            return ResponseEntity.badRequest().body(result);
        }

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

        // 포인트 차감 및 업데이트
        member.setPoint(member.getPoint() - rCommunityWrite.getReward());
        mr.save(member);  // 멤버 정보 업데이트

        rcr.save(post);  // 게시글 저장

        result.put("success", true);
        result.put("post", post);
        result.put("point", member.getPoint());

        return ResponseEntity.ok(result);
    }

    /**
     * 게시물 상세 정보를 조회합니다.
     * @param rnum 게시물 ID
     * @return 게시물 상세 정보
     */
    @Transactional
    public RCommunityInfo getPostDetail(int rnum) {
        RCommunity post = rcr.findPostById(rnum);

        if (post != null) {
            post.setViews(post.getViews() + 1);  // 조회수 증가
            rcr.save(post);  // 업데이트된 게시글 저장
        }
        return rcr.findPostInfoById(rnum);
    }

    /**
     * 게시물을 업데이트합니다.
     * @param rnum 게시물 ID
     * @param rCommunityWrite 업데이트할 게시물 정보
     * @return 게시물 업데이트 결과와 정보
     */
    public HashMap<String, Object> updatePost(int rnum, RCommunityWrite rCommunityWrite) {
        HashMap<String, Object> result = new HashMap<>();

        // 게시글 찾기
        // RCommunity 엔티티를 ID(rnum)로 조회합니다. Optional을 사용하여 게시글이 존재하지 않을 경우를 안전하게 처리합니다.
        Optional<RCommunity> postOptional = rcr.findById(rnum);
        if (postOptional.isEmpty()) {
            // 게시글이 존재하지 않을 경우, 결과 HashMap에 실패 상태와 메시지를 설정합니다.
            result.put("success", false);
            result.put("message", "게시물을 찾을 수 없습니다.");
            return result;
        }

        // Optional에서 값을 안전하게 추출하여 RCommunity 객체를 가져옵니다.
        RCommunity post = postOptional.get();

        // DTO(RCommunityWrite)에서 값을 가져와 게시글 업데이트
        // 전달된 DTO 데이터를 사용하여 게시글의 제목, 내용, 위치 등을 업데이트합니다.
        post.setTitle(rCommunityWrite.getTitle());
        post.setContent(rCommunityWrite.getContent());
        post.setLocation(rCommunityWrite.getLocation());
        post.setLocation2(rCommunityWrite.getLocation2());

        // 날짜 변환
        // DTO의 시작일과 종료일을 LocalDateTime으로 변환하여 게시글의 날짜 필드에 설정합니다.
        post.setStartdate(rCommunityWrite.getStartdate().toLocalDateTime());
        post.setEnddate(rCommunityWrite.getEnddate().toLocalDateTime());

        // 사용자 ID 체크 (옵션: 필요한 경우)
        // DTO에서 사용자 ID가 제공된 경우, 유효한 Member 엔티티인지 확인합니다.
        // 만약 유효하지 않은 사용자 ID라면, 결과에 실패 상태와 메시지를 설정합니다.
        if (rCommunityWrite.getUserid() != null) {
            Optional<Member> memberOptional = mr.findById(rCommunityWrite.getUserid());
            if (memberOptional.isEmpty()) {
                result.put("success", false);
                result.put("message", "유효하지 않은 사용자 ID입니다.");
                return result;
            }
            Member member = memberOptional.get();
            post.setUserid(member); // 유효한 사용자 ID로 설정
        }

        // 게시글 저장
        // 업데이트된 게시글 정보를 데이터베이스에 저장합니다.
        rcr.save(post);

        // 성공 상태와 업데이트된 게시글 정보를 결과 HashMap에 설정합니다.
        result.put("success", true);
        result.put("post", post);
        return result;
    }


    /**
     * 게시물을 삭제합니다. 'picked' 필드의 상태에 따라 포인트를 반환할지 결정합니다.
     * @param rnum 게시물 ID
     * @return 게시물 삭제 결과와 포인트 반환 정보
     */
    @Transactional
    public HashMap<String, Object> deleteRCommunity(int rnum) {
        HashMap<String, Object> result = new HashMap<>();

        // 게시글을 조회하고, 게시글이 없으면 예외를 던짐
        RCommunity rc = rcr.findById(rnum).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 게시글 작성자 (User)를 조회
        Member member = rc.getUserid();

        // picked 필드가 "Y"인지 확인
        if (rc.getPicked() == 'Y') {
            // picked가 'Y'인 경우 포인트 반환하지 않고 게시글만 삭제
            rcr.delete(rc);
            result.put("point", member.getPoint()); // 반환된 포인트
            result.put("success", true);
            result.put("message", "게시글이 삭제되었습니다. 포인트는 반환되지 않습니다.");
        } else {
            // picked가 'Y'가 아닌 경우 포인트 반환
            member.setPoint(member.getPoint() + rc.getReward());
            mr.save(member); // 유저의 포인트 변경 사항을 저장

            // 게시글 삭제
            rcr.delete(rc);
            result.put("point", member.getPoint()); // 반환된 포인트
            result.put("success", true);
            result.put("message", "게시글이 삭제되었습니다. 포인트가 반환되었습니다.");
        }

        return result;
    }

    /**
     * 게시물의 채택 상태를 업데이트합니다.
     * @param rnum 게시물 ID
     * @param picked 채택 상태 ('Y' 또는 'N')
     * @return 업데이트 성공 여부
     */
    @Transactional
    public boolean updatePicked(String rnum, char picked) {
        int updatedRows = rcr.updatePicked(rnum, picked);
        return updatedRows > 0;
    }

    /**
     * 사용자 ID로 Member 객체를 조회합니다.
     * @param userid 사용자 ID
     * @return Member 객체 (옵션)
     */
    public Optional<Member> findMemberByUserid(String userid) {
        return mr.findByUserid(userid);
    }

    /**
     * 사용자 ID로 게시물 목록을 조회합니다.
     *
     * @param userid 사용자 객체
     * @return 사용자 ID에 따른 게시물 목록
     */
// 사용자가 작성한 게시글 목록 조회 (페이지네이션 지원)
    public Page<RCommunitySummary> getPostsByUserId(String userId, Pageable pageable) {
        Optional<Member> optionalMember = mr.findByUserid(userId);

        if (optionalMember.isPresent()) {
            Member user = optionalMember.get();
            return rcr.findByUserid(user, pageable);
        } else {
            return Page.empty();
        }
    }



}
