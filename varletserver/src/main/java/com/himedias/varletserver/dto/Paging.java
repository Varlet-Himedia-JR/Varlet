package com.himedias.varletserver.dto;

import lombok.Data;

@Data
public class Paging {
    private int page = 1;
    private int startNum;
    private int displayRow=5;

    public void calPaging() {
        startNum = (page-1) * displayRow + 1;
    }
}
