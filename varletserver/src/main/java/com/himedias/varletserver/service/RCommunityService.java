package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.RCommunitySummary;
import com.himedias.varletserver.dto.RCommunityWrite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RCommunityService {

    @Autowired
    private RCommunityRepository rcr;

    public List<RCommunitySummary> getPostList() {
        return rcr.findAllBy(Sort.by(Sort.Direction.DESC, "rnum"));
    }

//    public void savePost(RCommunityWrite postDto) {
//        rcr.save(postDto);
//    }

}
