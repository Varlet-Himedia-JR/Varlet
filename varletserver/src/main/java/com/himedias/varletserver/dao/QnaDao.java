package com.himedias.varletserver.dao;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Qna;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class QnaDao {

    @Autowired
    EntityManager em;

    public List<Qna> getQnaList(Paging paging) {
        String sql = "select q from Qna q order by q.qseq desc";
        List<Qna> list = em.createQuery(sql, Qna.class)
                .setFirstResult(paging.getStartNum()-1)
                .setMaxResults(paging.getDisplayRow())
                .getResultList();
        return list;
    }
}
