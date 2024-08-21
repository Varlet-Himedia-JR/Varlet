package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.DayscheduleRepository;
import com.himedias.varletserver.entity.Dayschedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DayscheduleService {
    @Autowired
    DayscheduleRepository dr;


    public void insertDayschedule(Dayschedule dayschedule) {
        dr.save(dayschedule);
    }

    public void deleteDayschedule(String dseq) {
        dr.deleteById(dseq);
    }
}
