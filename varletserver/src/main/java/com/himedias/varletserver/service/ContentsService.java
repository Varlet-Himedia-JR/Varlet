package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ContentsRepository;
import com.himedias.varletserver.dao.TimetableRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Contents;
import com.himedias.varletserver.entity.Timetable;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

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


    public void writeContents(Contents contents) {
        cr.save(contents);
    }

    public List<Contents> searchContents(String query) {
        return cr.searchByMultipleFields(query);
    }

    public List<Contents> getRecentContents() {
        return cr.getRecentContents();
    }

    public void updateContents(Contents contents) {cr.save(contents); }

    public void deleteContents(int cseq) {
        cr.deleteByTseq(cseq);
    }
}
