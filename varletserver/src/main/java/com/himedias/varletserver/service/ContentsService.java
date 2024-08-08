package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ContentsRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Contents;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ContentsService {

    @Autowired
    ContentsRepository cr;

    public Page<Contents> getContentsList(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), Sort.by(Sort.Order.desc("cseq")));
        // Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return cr.findAll(pageRequest);
    }

    public Contents getQnaView(int cseq) {
        return cr.findById(cseq).get();
    }
}
