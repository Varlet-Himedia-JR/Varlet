package com.himedias.varletserver.dto.RCRcommend;

import com.himedias.varletserver.entity.Image;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

/**
 * DTO for {@link com.himedias.varletserver.entity.Rcrecommend}
 */

@Setter
@Getter
@Transactional
public class RcrecommendWrite implements Serializable {

    @NotNull
    private String userid;

    @NotBlank
    @Size(max = 2000)
    private String  content;

    @NotNull
    @Size(max = 100)
    private  String image;

    @NotNull
    @Size(max = 200)
    private  String saveimages;

    @Getter
    @Setter
    private int rnum;



}