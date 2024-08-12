package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    List<Reply> findByRseq(int rseq);
}
