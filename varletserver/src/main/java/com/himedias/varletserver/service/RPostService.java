package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RPostService {

    @Autowired
    RPostRepository rpr;

}
