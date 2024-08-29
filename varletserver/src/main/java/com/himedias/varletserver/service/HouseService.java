package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.HouseRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Contents;
import com.himedias.varletserver.entity.House;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseService {

    @Autowired
    HouseRepository hr;

    public Page<House> getHouse(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), Sort.by(Sort.Order.desc("hseq")));
        return hr.findAll(pageRequest);
    }

    public List<House> searchHouse(String query) {
        return hr.searchByMultipleFields(query);
    }
}
