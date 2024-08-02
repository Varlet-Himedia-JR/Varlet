package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.QnaDao;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Qna;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class QnaService {

    @Autowired
    QnaDao qdao;

    public List<Qna> getQnaList(Paging paging) {
        return qdao.getQnaList(paging);
    }
}
