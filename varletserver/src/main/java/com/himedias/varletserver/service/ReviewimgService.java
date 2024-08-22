package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReviewimgRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ReviewimgService {

    @Autowired
    private ReviewimgRepository rsr;

}
