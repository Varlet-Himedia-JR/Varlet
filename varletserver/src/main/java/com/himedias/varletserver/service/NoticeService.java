package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.NoticeRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Notice;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class NoticeService {

    @Autowired
    NoticeRepository nr;

    public Page<Notice> getNoticeList(Paging paging) {
        int pageNumber = paging.getPage() - 1;
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), Sort.by(Sort.Order.desc("indate")));
        return nr.findAll(pageRequest);
    }

    public Notice getNoticeView(int nseq) {
        return nr.findById(nseq).get();
    }
}
