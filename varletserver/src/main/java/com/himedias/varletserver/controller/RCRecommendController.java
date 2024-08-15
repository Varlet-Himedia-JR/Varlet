package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import com.himedias.varletserver.service.RCRecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/rcrecommend")
public class RCRecommendController {

    @Autowired
    private RCRecommendService rcs;

    @Value("${file.upload-dir}")
    private String uploadDir; // 파일이 저장될 디렉토리

    @PostMapping("/writeRecommend/{rnum}")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Integer> writeRecommend(
            @PathVariable("rnum") int rnum,
            @RequestParam("userid") String userid,
            @RequestParam("content") String content,
            @RequestParam(value = "saveimages", required = false
    ) List<String> files) {
        RCommunity rc = rcs.findRCommunityById(rnum);
        Member member = rcs.findMemberById(userid);

        Rcrecommend rcrecommend = new Rcrecommend();
        rcrecommend.setContent(content);
        rcrecommend.setRnum(rc);
        rcrecommend.setUserid(member);

        Rcrecommend savedRcrecommend = rcs.saveRcrecommend(rcrecommend, files);

        return Map.of("rcum", savedRcrecommend.getRcnum());
    }

    @PostMapping("/fileup")
    public ResponseEntity<HashMap<String, Object>> fileup(@RequestParam("image") MultipartFile[] files) {
        HashMap<String, Object> result = new HashMap<>();
        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();

        System.out.println("실행됨?");

        ArrayList<String> savedFilenames = new ArrayList<>();

        System.out.println("save filenames:" + savedFilenames);

        // 업로드 디렉토리 설정
        File uploadDirFile = new File(uploadDir, "RcommunityImages");
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        System.out.println("upload dir:" + uploadDirFile.getAbsolutePath());

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = originalFilename.substring(0, originalFilename.indexOf("."));
            String saveFilename = filename + dt + extension;

            Path filePath = Paths.get(uploadDirFile.getAbsolutePath(), saveFilename);

            try {
                Files.write(filePath, file.getBytes()); // 파일을 지정된 폴더에 저장
                savedFilenames.add(saveFilename);
            } catch (IOException e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        result.put("savefilenames", savedFilenames);  // 여러 파일명을 반환
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
