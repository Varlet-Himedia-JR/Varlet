package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    List<Reply> findByRseq(int rseq);
}
