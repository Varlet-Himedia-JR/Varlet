package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCommunityRepository;
import com.himedias.varletserver.dto.RCommunityDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RCommunityService {

    @Autowired
    private RCommunityRepository rcr;

    public List<RCommunityDto> getPostList() {
        return rcr.findAll(Sort.by(Sort.Direction.DESC, "rnum"));
    }

    public void savePost(RCommunityDto postDto) {
        rcr.save(postDto);
    }

}
