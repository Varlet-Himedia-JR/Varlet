package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    Optional<Member> findByEmail(String email);
    Optional<Member> findBySnsid(String id);
    Optional<Member> findByUserid(String userid);
    Optional<Member> findByNickname(String nickname);
    boolean existsByNickname(String nickname);

    // 권한과 같이 조회 - 쿼리가 한번 날라감.
    @EntityGraph(attributePaths = {"memberRoleList"}) // 권한 조회
    @Query("select m from Member m where m.userid = :userid")
    Member getWithRoles(@Param("userid")String userid);

    @Modifying //DB 수정하는 어노테이션
    @Query("UPDATE Member m SET m.pwd = :pwd, m.name = :name, m.nickname = :nickname, m.email = :email, m.phone = :phone, m.zip_code = :zip_code, m.address = :address, m.d_address = :d_address, m.profileimg = :profileimg WHERE m.userid = :userid")
    void updateMember(
            @Param("userid") String userid,
            @Param("pwd") String pwd,
            @Param("name") String name,
            @Param("nickname") String nickname,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("zip_code") String zip_code,
            @Param("address") String address,
            @Param("d_address") String d_address,
            @Param("profileimg") String profileimg
    );


    @Query("select m.userid from Member m where m.email = :email")
    Optional<String> findId(@Param("email") String email);

    @Query("select m from Member m where m.userid = :userid")
    Member findByUserId(String userid);

    boolean existsByEmail(String email);

    @Modifying //DB 수정하는 어노테이션
    @Query("UPDATE Member m SET m.pwd = :pwd WHERE m.userid = :userid")
    void updatePwd(String pwd);
}