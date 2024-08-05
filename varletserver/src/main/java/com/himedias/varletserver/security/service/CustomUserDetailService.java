package com.himedias.varletserver.security.service;

import com.himedias.varletserver.dao.MemberRepository;
import com.himedias.varletserver.dto.MemberDTO;
import com.himedias.varletserver.entity.Member;
import lombok.RequiredArgsConstructor;
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
        if(member == null) {
            throw new UsernameNotFoundException(username + " - User Not found");
        }

        // 존재하면 로그인 처리를 위해 Entity 데이터를 DTO 데이터로 옮김
        MemberDTO memberdto = new MemberDTO(
                member.getNickname(),
                member.getPwd(),
                member.getEmail(),
                member.getPhone(),
                member.getProvider(),
                member.getSnsid(),
                member.getProfileimg(),
                member.getZipCode(),
                member.getAddress(),
                member.getDAddress(),
                member.getIndate(),
                member.getIsLogin(),
                member.getMemberRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList())
        );
        log.info(memberdto);
        log.info(member);
        return memberdto;
    }
}
