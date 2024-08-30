package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.PaymentRepository;
import com.himedias.varletserver.entity.Payments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository pr;

    public void processPayment(String userId, Payments paymentRequest) {
        // userId를 처리하는 추가 로직이 필요할 수 있음
        // 예를 들어, userId와 관련된 추가 정보를 설정할 수 있습니다.

        // 결제 엔티티를 데이터베이스에 저장
        pr.save(paymentRequest);
    }

    public List<Payments> getPaymentsByUserId(String userId) {
        return pr.findByUserid(userId);
    }
}
