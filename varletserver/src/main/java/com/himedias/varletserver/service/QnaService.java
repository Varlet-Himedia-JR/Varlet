package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.QnaRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Qna;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class QnaService {

    @Autowired
    QnaRepository qr;

    public Page<Qna> getQnaList(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), Sort.by(Sort.Order.desc("indate")));
        // Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return qr.findAll(pageRequest);
    }

    public void writeQna(Qna qna) {
        qr.save(qna);
    }

    public Qna getQnaView(int qseq) {
        return qr.findById(qseq).get();
    }

    public void deleteQna(int qseq) {
        qr.deleteById(qseq);
    }
}