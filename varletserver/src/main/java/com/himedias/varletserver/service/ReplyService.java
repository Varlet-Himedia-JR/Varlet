package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReplyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ReplyService {

    @Autowired
    ReplyRepository re;
}

