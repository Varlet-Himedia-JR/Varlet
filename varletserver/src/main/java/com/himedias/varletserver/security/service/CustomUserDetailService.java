package com.himedias.varletserver.security.service;

import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dto.MemberDTO;
import com.himedias.varletserver.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final MemberRepository mr;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // loadUserByUsername 역할은 전에 사용하던 getMember 메서드의 역할
        log.info("--------------loadUserByUsername--------------" + username);
        // 멤버 조회
        Member member = mr.getWithRoles(username);
        // 없으면 Not Found 처리
        if (member == null) {
            throw new UsernameNotFoundException(username + " - User Not found");
        }
        System.out.println("----login info----");
        System.out.println(member.toString());

        // 존재하면 로그인 처리를 위해 Entity 데이터를 DTO 데이터로 옮김
        MemberDTO memberdto = new MemberDTO(
                member.getUserid(),
                member.getPwd(),
                member.getName(),
                member.getNickname(),
                member.getEmail(),
                member.getPhone(),
                member.getZip_code(),
                member.getAddress(),
                member.getD_address(),
                member.getIndate(),
                member.getIs_login(),
                member.getProvider(),
                member.getSnsid(),
                member.getProfileimg(),
                member.getPoint(),
                member.getMemberRoleList().stream()// 사용자 역할 리스트를 스트림으로 변환
                        .map(memberRole -> memberRole.name()) // 각 역할의 이름을 추출
                        .collect(Collectors.toList()) // 리스트로 수집
        );
        log.info(memberdto);
        log.info(member);
        return memberdto; // MemberDTO를 반환하여 Spring Security에서 사용자 정보를 사용할 수 있도록 합니다.
    }
}
