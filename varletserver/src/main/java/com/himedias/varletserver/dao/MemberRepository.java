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

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    Optional<Member> findByEmail(String email);
    Optional<Member> findBySnsid(String id);
    Optional<Member> findByNickname(String nickname);
    boolean existsByNickname(String nickname);

    // 권한과 같이 조회 - 쿼리가 한번 날라감.
    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("select m from Member m where m.userid = :userid")
    Member getWithRoles(@Param("userid")String userid);

    @Modifying
    @Query("UPDATE Member m SET m.pwd = :pwd, m.name = :name, m.nickname = :nickname, m.email = :email, m.phone = :phone, m.zipCode = :zipCode, m.address = :address, m.d_address = :d_address, m.profileimg = :profileimg WHERE m.userid = :userid")
    void updateMember(
            @Param("userid") String userid,
            @Param("pwd") String pwd,
            @Param("name") String name,
            @Param("nickname") String nickname,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("zipCode") String zipCode,
            @Param("address") String address,
            @Param("d_address") String d_address,
            @Param("profileimg") String profileimg
    );

    // 사용자 ID에 따른 리뷰를 가져오는 메서드
    @Query("SELECT r FROM Review r WHERE r.userid = :userid")
    Page<Review> findByUserid(@Param("userid") String userid, Pageable pageable);


    @Query("select m.userid from Member m where m.email = :email")
    Optional<String> findId(@Param("email") String email);

    @Query("select m from Member m where m.userid = :userid")
    Member findByUserId(String userid);
}