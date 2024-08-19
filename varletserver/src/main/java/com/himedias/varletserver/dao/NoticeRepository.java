package com.himedias.varletserver.dao;


import com.himedias.varletserver.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
}
