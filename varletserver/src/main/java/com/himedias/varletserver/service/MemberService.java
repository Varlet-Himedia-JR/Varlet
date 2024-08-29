
package com.himedias.varletserver.service;


import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dao.ReviewRepository;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.security.CustomSecurityConfig;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Transactional
public class MemberService {

    @Autowired
    MemberRepository mr;

    public Member getMember(String email) {
        // Optional : 검색결과가  null 이어서 발생할 수 있는 예외처리나 에러를 방지하지 하기위한 자바의 도구입니다.  null  값이 있을지도 모를 객체를 감싸서  null 인데 접근하려는 것을 사전에 차단합니다.  다음과 같이 검증을 거친후 사용되어집니다
        Optional<Member> mem = mr.findByEmail( email );
        //  isPresent() : 해당 객체가 인스턴스를 저장하고 있다면 true , null 이면  flase 를 리턴
        // isEmpty() : isPresent()의 반대값을 리턴합니다
        if( !mem.isPresent() ){
            return null;
        }else {
            // get() : Optional 내부 객체를 꺼내서 리턴합니다
            return mem.get();
        }
    }

    public Member getMemberByUserid(String userid) {
        Optional<Member> mem = mr.findByUserid( userid );
        if( !mem.isPresent() ){
            return null;
        }else {
            return mem.get();
        }
    }

    public Member getMemberBySnsid(String id) {
        Optional<Member> mem = mr.findBySnsid( id );
        if( !mem.isPresent() ){
            return null;
        }else{
            return mem.get();
        }
    }

    public void insertMember(Member member) {
        mr.save(member);
    }

    public boolean checkExistsByNickname(String nickname) {
        return mr.existsByNickname( nickname );
    }


    @Autowired
    private HttpSession session;

    public void logout() {
        // 무효화 세션
        if (session != null) {
            session.invalidate();
        }
    }

    public void updateInfo(Member member) {
        Optional<Member> existingMember = mr.findById(member.getUserid());

        if(existingMember.isPresent()) {
            // 엔티티가 존재할 경우에만 업데이트 수행
            mr.updateMember(
                    member.getUserid(),
                    member.getPwd(),
                    member.getName(),
                    member.getNickname(),
                    member.getEmail(),
                    member.getPhone(),
                    member.getZip_code(),
                    member.getAddress(),
                    member.getD_address(),
                    member.getProfileimg()
            );
        } else {
            // 기존 사용자가 없으면 에러 처리
            throw new IllegalArgumentException("해당 회원이 존재하지 않습니다.");
        }
    }

    @Autowired
    private EmailService es;

    private Map<String, String> verificationCodes = new HashMap<>();

    // 인증 코드 생성 및 이메일 발송
    public void sendVerificationCode(String email) {
        String verificationCode = generateVerificationCode();
        verificationCodes.put(email, verificationCode);

        // 이메일 발송
        String subject = "valet 인증코드 ";
        String text = "인증번호 : " + verificationCode;
        es.sendSimpleMessage(email, subject, text);
        System.out.println(verificationCode);
    }

    // 인증 코드 생성 로직 (6자리 숫자 코드)
    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // 이메일과 인증 코드를 검증하여 아이디 반환
    public String verifyCodeAndFindId(String email, String code) {
        String storedCode = verificationCodes.get(email);

        if (storedCode != null && storedCode.equals(code)) {
            verificationCodes.remove(email); // 검증 후 코드 삭제
            return mr.findId(email).orElse(null);
        } else {
            return null;
        }
    }


    public String getProfileImageUrl(String userid) {
        Member member = mr.findByUserId(userid);
        if (member != null && member.getProfileimg() != null) {
            return member.getProfileimg(); // 프로필 이미지 URL 반환

        }
        return null; // 프로필 이미지가 없으면 null 반환

    }

    public boolean isEmailUnique(String email) {
        return !mr.existsByEmail(email);
    }

    public String verifyCodeAndFindPwd(String email, String code) {
        String storedCode = verificationCodes.get(email);

        if (storedCode != null && storedCode.equals(code)) {
            verificationCodes.remove(email); // 검증 후 코드 삭제
            return "ok";
        } else {
            return null;
        }
    }
    @Autowired
    CustomSecurityConfig cc;


    public void updatePwd(String pwd) {
        mr.updatePwd(pwd);
    }
}