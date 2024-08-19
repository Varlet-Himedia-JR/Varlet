package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ImageRepository;
import com.himedias.varletserver.entity.Image;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    @Autowired
    private ImageRepository ir;

    public Image saveImage(Image image) {
        return ir.save(image);
    }

}
