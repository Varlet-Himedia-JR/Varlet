package com.himedias.varletserver.dto.Rcommunity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

/**
 * DTO for {@link com.himedias.varletserver.entity.RCommunity}
 */
@Getter
@Setter
@Transactional
public class RCommunityWrite {

    @NotNull
    private String userid;

    @NotNull
    private int location;

    @NotNull
    private int location2;

    @NotNull
    @Size(min = 0)
    private int reward;

    @NotBlank
    @Size(min = 0, max = 50)
    private String title;

    @NotBlank
    @Size(min = 0, max = 2500)
    private String content;

    @NotNull
    private Timestamp startdate;

    @NotNull
    private Timestamp enddate;

    private char picked;

}