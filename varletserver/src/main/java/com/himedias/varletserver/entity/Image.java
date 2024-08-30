package com.himedias.varletserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "image", schema = "varlet")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "userid", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rcnum", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Rcrecommend rcRecommend;

    @Column(name = "image_name", nullable = false, length = 255)
    private String imageName;

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @CurrentTimestamp
    @Column(name = "upload_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp uploadDate;

    // 새로 추가된 필드
    @Enumerated(EnumType.STRING)
    @Column(name = "image_type", columnDefinition = "ENUM('숙소','여행지','기타') DEFAULT '기타'")
    private ImageType imageType = ImageType.기타;

    // 기본 생성자
    public Image() {
    }

    // 필요한 필드를 받는 생성자
    public Image(Member member, Rcrecommend rcRecommend, String imageName, String filePath, ImageType imageType) {
        this.member = member;
        this.rcRecommend = rcRecommend;
        this.imageName = imageName;
        this.filePath = filePath;
        this.imageType = imageType;
        this.uploadDate = new Timestamp(System.currentTimeMillis());
    }

    // Rcrecommend 객체에 이미지 추가 메서드
    public void setRcRecommend(Rcrecommend rcRecommend) {
        this.rcRecommend = rcRecommend;

        // Rcrecommend 객체에 현재 이미지가 포함되어 있지 않은 경우
        if (!rcRecommend.getImages().contains(this)) {
            rcRecommend.getImages().add(this);
        }
    }

    // ImageType 열거형(Enum)
    public enum ImageType {
        숙소, 여행지, 기타
    }
}
