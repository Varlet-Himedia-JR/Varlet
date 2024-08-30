package com.himedias.varletserver.dao;

import com.himedias.varletserver.entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payments, Integer> {
    List<Payments> findByUserid(String userId);
}
