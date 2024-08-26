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
     * 총 게시물 수를 계산합니다.
     * @param location 위치 정보 (선택적)
     * @param location2 두 번째 위치 정보 (선택적)
     * @return 게시물 총 수
     */
// 서비스 레이어에서 게시물 목록을 가져오는 메소드
    public List<RCommunitySummary> getPostList(Integer location, Integer location2, Paging paging) {
        // 페이지 번호, 페이지당 항목 수, 정렬 정보를 기반으로 Pageable 객체 생성
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), paging.getSort());

        // location과 location2가 모두 있는 경우 해당 위치에 맞는 게시물 목록을 가져옴
        if (location != null && location2 != null) {
            return rcr.findByLocationAndLocation2(location, location2, pageable).getContent();
        }
        // location만 있는 경우 해당 위치에 맞는 게시물 목록을 가져옴
        else if (location != null) {
            return rcr.findByLocation(location, pageable).getContent();
        }
        // location과 location2가 없는 경우 모든 게시물 목록을 가져옴 (댓글 수 포함)
        else {
            return rcr.findAllWithReplyCount(pageable).getContent();
        }
    }

    // 서비스 레이어에서 총 게시물 수를 계산하는 메소드
    public int getTotalPostCount(Integer location, Integer location2) {
        // location과 location2가 모두 있는 경우 해당 위치의 게시물 수를 반환
        if (location != null && location2 != null) {
            return rcr.countByLocationAndLocation2(location, location2);
        }
        // location만 있는 경우 해당 위치의 게시물 수를 반환
        else if (location != null) {
            return rcr.countByLocation(location);
        }
        // location과 location2가 없는 경우 전체 게시물 수를 반환
        else {
            return (int) rcr.count();
        }
    }


    /**
     * 새 게시물을 작성합니다.
     * @param rCommunityWrite 게시물 작성 정보
     * @return 게시물 작성 결과와 정보
     */
    @Transactional
    public ResponseEntity<HashMap<String, Object>> writePost(RCommunityWrite rCommunityWrite) {
        // 결과를 저장할 HashMap 객체 생성
        HashMap<String, Object> result = new HashMap<>();

        // 사용자 ID를 기반으로 데이터베이스에서 사용자 정보를 조회
        Optional<Member> memberOptional = mr.findById(rCommunityWrite.getUserid());

        // 사용자 정보가 없는 경우 (유효하지 않은 사용자 ID)
        if (memberOptional.isEmpty()) {
            result.put("success", false);  // 처리 실패 여부 설정
            result.put("message", "유효하지 않은 사용자 ID입니다.");  // 실패 메시지 설정
            return ResponseEntity.badRequest().body(result);  // HTTP 400 상태와 함께 결과 반환
        }

        // 사용자 정보가 있는 경우 Member 객체로 가져옴
        Member member = memberOptional.get();

        // 사용자의 포인트가 보상금액보다 적은지 확인
        if (rCommunityWrite.getReward() > member.getPoint()) {
            result.put("success", false);  // 처리 실패 여부 설정
            result.put("message", "의뢰금은 보유 포인트를 초과할 수 없습니다.");  // 실패 메시지 설정
            return ResponseEntity.badRequest().body(result);  // HTTP 400 상태와 함께 결과 반환
        }

        // 게시글 정보를 저장할 RCommunity 객체 생성
        RCommunity post = new RCommunity();
        post.setTitle(rCommunityWrite.getTitle());  // 게시글 제목 설정
        post.setContent(rCommunityWrite.getContent());  // 게시글 내용 설정
        post.setLocation(rCommunityWrite.getLocation());  // 게시글 위치 설정
        post.setLocation2(rCommunityWrite.getLocation2());  // 게시글 위치2 설정
        post.setReward(rCommunityWrite.getReward());  // 게시글 보상금액 설정
        post.setUserid(member);  // 작성자 설정 (Member 엔티티)
        post.setStartdate(rCommunityWrite.getStartdate().toLocalDateTime());  // 시작 날짜 설정
        post.setEnddate(rCommunityWrite.getEnddate().toLocalDateTime());  // 종료 날짜 설정

        // 사용자의 포인트를 보상금액만큼 차감
        member.setPoint(member.getPoint() - rCommunityWrite.getReward());
        mr.save(member);  // 변경된 사용자 정보를 데이터베이스에 저장

        rcr.save(post);  // 작성된 게시글을 데이터베이스에 저장

        result.put("success", true);  // 처리 성공 여부 설정
        result.put("post", post);  // 저장된 게시글 정보 설정
        result.put("point", member.getPoint());  // 차감 후 남은 사용자 포인트 설정

        // 처리 결과를 HTTP 200 OK 상태와 함께 클라이언트에게 반환
        return ResponseEntity.ok(result);
    }

    /**
     * 게시물 상세 정보를 조회합니다.
     * @param rnum 게시물 ID
     * @return 게시물 상세 정보
     */
// 트랜잭션 내에서 특정 게시글의 상세 정보를 처리하는 서비스 메소드
    @Transactional
    public RCommunityInfo getPostDetail(int rnum) {
        // 게시글 ID를 기반으로 데이터베이스에서 게시글 정보를 조회
        RCommunity post = rcr.findPostById(rnum);

        // 게시글이 존재하는 경우
        if (post != null) {
            // 조회수를 1 증가시킴
            post.setViews(post.getViews() + 1);

            // 업데이트된 게시글 정보를 데이터베이스에 저장
            rcr.save(post);
        }

        // 게시글 ID를 기반으로 RCommunityInfo 프로젝션을 조회하여 반환
        return rcr.findPostInfoById(rnum);
    }

    /**
     * 게시물을 업데이트합니다.
     * @param rnum 게시물 ID
     * @param rCommunityWrite 업데이트할 게시물 정보
     * @return 게시물 업데이트 결과와 정보
     */
// 특정 게시글을 업데이트하는 서비스 메소드
    public HashMap<String, Object> updatePost(int rnum, RCommunityWrite rCommunityWrite) {
        // 결과를 저장할 HashMap 객체 생성
        HashMap<String, Object> result = new HashMap<>();

        // 게시글 ID를 기반으로 데이터베이스에서 게시글 정보를 조회
        Optional<RCommunity> postOptional = rcr.findById(rnum);

        // 게시글이 존재하지 않을 경우
        if (postOptional.isEmpty()) {
            // 실패 상태와 메시지를 결과 HashMap에 설정
            result.put("success", false);
            result.put("message", "게시물을 찾을 수 없습니다.");
            return result;
        }

        // Optional에서 RCommunity 객체를 가져옴
        RCommunity post = postOptional.get();

        // 전달된 DTO 데이터를 사용하여 게시글의 제목, 내용, 위치 등을 업데이트
        post.setTitle(rCommunityWrite.getTitle());
        post.setContent(rCommunityWrite.getContent());
        post.setLocation(rCommunityWrite.getLocation());
        post.setLocation2(rCommunityWrite.getLocation2());

        // DTO의 시작일과 종료일을 LocalDateTime으로 변환하여 게시글의 날짜 필드에 설정
        post.setStartdate(rCommunityWrite.getStartdate().toLocalDateTime());
        post.setEnddate(rCommunityWrite.getEnddate().toLocalDateTime());

        // 사용자 ID가 제공된 경우 유효한 Member 엔티티인지 확인하고 게시글의 작성자를 업데이트
        if (rCommunityWrite.getUserid() != null) {
            Optional<Member> memberOptional = mr.findById(rCommunityWrite.getUserid());
            // 유효하지 않은 사용자 ID일 경우
            if (memberOptional.isEmpty()) {
                result.put("success", false);
                result.put("message", "유효하지 않은 사용자 ID입니다.");
                return result;
            }
            // 유효한 사용자 ID로 설정
            Member member = memberOptional.get();
            post.setUserid(member);
        }

        // 업데이트된 게시글 정보를 데이터베이스에 저장
        rcr.save(post);

        // 성공 상태와 업데이트된 게시글 정보를 결과 HashMap에 설정
        result.put("success", true);
        result.put("post", post);
        return result;
    }


    /**
     * 게시물을 삭제합니다. 'picked' 필드의 상태에 따라 포인트를 반환할지 결정합니다.
     * @param rnum 게시물 ID
     * @return 게시물 삭제 결과와 포인트 반환 정보
     */
// 특정 게시글을 삭제하는 서비스 메소드
    @Transactional
    public HashMap<String, Object> deleteRCommunity(int rnum) {
        // 결과를 저장할 HashMap 객체 생성
        HashMap<String, Object> result = new HashMap<>();

        // 게시글 ID를 기반으로 데이터베이스에서 게시글 정보를 조회하고, 없으면 예외를 던짐
        RCommunity rc = rcr.findById(rnum).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 게시글 작성자를 조회
        Member member = rc.getUserid();

        // 게시글의 picked 필드가 'Y'인지 확인
        if (rc.getPicked() == 'Y') {
            // picked가 'Y'인 경우, 포인트를 반환하지 않고 게시글만 삭제
            rcr.delete(rc);

            // 결과 HashMap에 현재 포인트와 메시지를 설정
            result.put("point", member.getPoint());
            result.put("success", true);
            result.put("message", "게시글이 삭제되었습니다. 포인트는 반환되지 않습니다.");
        } else {
            // picked가 'Y'가 아닌 경우, 보상 포인트를 작성자에게 반환
            member.setPoint(member.getPoint() + rc.getReward());
            mr.save(member); // 유저의 변경된 포인트 정보를 데이터베이스에 저장

            // 게시글 삭제
            rcr.delete(rc);

            // 결과 HashMap에 반환된 포인트와 메시지를 설정
            result.put("point", member.getPoint());
            result.put("success", true);
            result.put("message", "게시글이 삭제되었습니다. 포인트가 반환되었습니다.");
        }

        // 처리 결과를 반환
        return result;
    }

    /**
     * 게시물의 채택 상태를 업데이트합니다.
     * @param rnum 게시물 ID
     * @param picked 채택 상태 ('Y' 또는 'N')
     * @return 업데이트 성공 여부
     */
// 게시글의 picked 상태를 업데이트하는 서비스 메소드
    @Transactional
    public boolean updatePicked(String rnum, char picked) {
        // 레포지토리의 updatePicked 메소드를 호출하여 업데이트된 행의 수를 반환
        int updatedRows = rcr.updatePicked(rnum, picked);

        // 업데이트된 행의 수가 0보다 큰 경우 true를 반환하여 성공을 알림
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
    public Page<RCommunityMyList> getPostsByUserId(String userId, Pageable pageable) {
        Optional<Member> optionalMember = mr.findByUserid(userId);

        if (optionalMember.isPresent()) {
            Member user = optionalMember.get();
            return rcr.findByUserid(user, pageable);
        } else {
            return Page.empty();
        }
    }



}
