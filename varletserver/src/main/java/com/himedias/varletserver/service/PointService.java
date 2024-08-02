package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.PointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PointService {

    @Autowired
    PointRepository pr;

}
