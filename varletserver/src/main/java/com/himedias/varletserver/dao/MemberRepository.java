package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    Optional<Member> findByEmail(String email);
    Optional<Member> findBySnsid(String id);
    Optional<Member> findByNickname(String nickname);

    // 권한과 같이 조회 - 쿼리가 한번 날라감.
    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("select m from Member m where m.userid = :userid")
    Member getWithRoles(@Param("userid")String userid);

}
