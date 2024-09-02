package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ImageRepository;
import com.himedias.varletserver.entity.Image;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Rcrecommend;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;

@Service
public class ImageService {


    @Autowired
    private ServletContext servletContext;

    @Autowired
    private ImageRepository ir;

    public void saveFiles(MultipartFile[] files, Member member, Rcrecommend rcrecommend, HashMap<String, String> allParams) {
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            if (!file.isEmpty()) {
                String fileName = storeFile(file);

                // 이미지 타입을 맵에서 가져오기
                String imageTypeStr = allParams.get("image_type_" + i);
                Image.ImageType imageType;
                try {
                    imageType = Image.ImageType.valueOf(imageTypeStr);
                } catch (IllegalArgumentException e) {
                    imageType = Image.ImageType.기타; // 기본값 설정
                }

                // 이미지 엔티티 생성 및 설정
                Image image = new Image();
                image.setRcRecommend(rcrecommend);
                image.setImageName(fileName);
                image.setFilePath("/uploads/" + fileName);
                image.setImageType(imageType != null ? imageType : Image.ImageType.기타);
                image.setMember(member);

                // 이미지 정보 데이터베이스에 저장
                ir.save(image);

                // 디버깅 로그
                System.out.println("Saved image with type: " + image.getImageType());
            }
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("File must have a name");
        }

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = System.currentTimeMillis() + fileExtension;

        try {
            // ServletContext를 사용하여 업로드 디렉토리의 실제 경로를 얻습니다.
            String webAppPath = servletContext.getRealPath("");
            Path uploadPath = Paths.get(webAppPath, "uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path path = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File stored at: " + path.toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + fileName, e);
        }

        return fileName;
    }

}
