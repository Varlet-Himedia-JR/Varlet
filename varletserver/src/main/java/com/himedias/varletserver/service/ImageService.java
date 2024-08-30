package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ImageRepository;
import com.himedias.varletserver.entity.Image;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Rcrecommend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {

    @Value("${file.upload-dir}")
    private String uploadDir;


    @Autowired
    private ImageRepository ir;

    public void saveFiles(MultipartFile[] files, Member member, Rcrecommend rcrecommend, Image.ImageType imageType) {
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileName = storeFile(file);

                // 이미지 엔티티 생성 및 설정
                Image image = new Image();
                image.setRcRecommend(rcrecommend);
                image.setImageName(fileName);
                image.setFilePath("/uploads/" + fileName);
                image.setImageType(imageType != null ? imageType : Image.ImageType.기타); // 기본값 설정
                image.setMember(member);

                // 이미지 정보 데이터베이스에 저장
                ir.save(image);

                // 디버깅 로그
                System.out.println("Saved image with type: " + image.getImageType());
            }
        }
    }



    private String storeFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("File must have a name");
        }

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = System.currentTimeMillis() + fileExtension;

        try {
            Path path = Paths.get(uploadDir, fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + fileName, e);
        }

        return fileName;
    }

}
