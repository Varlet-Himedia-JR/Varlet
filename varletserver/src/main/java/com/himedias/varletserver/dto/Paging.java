package com.himedias.varletserver.dto;

import lombok.Data;



import lombok.Data;
import org.springframework.data.domain.Sort;

@Data
public class Paging {
    private int page =1;
    private int totalCount;
    private int beginPage;
    private int endPage;
    private int displayRow=10;
    private int displayPage=10;
    private boolean prev;
    private boolean next;
    private int startNum;
    private int endNum;
    private Sort sort;

    public void calPaging() {
        endPage = ( (int)Math.ceil( page/(double)displayPage ) ) * displayPage;
        beginPage = endPage - (displayPage - 1);
        int totalPage = (int)Math.ceil( totalCount/(double)displayRow );
        if(totalPage<endPage){
            endPage = totalPage;
            next = false;
        }else{
            next = true;
        }

        prev = (beginPage==1)?false:true;
        startNum = (page-1)*displayRow+1;
        endNum = page*displayRow;
    }

}
