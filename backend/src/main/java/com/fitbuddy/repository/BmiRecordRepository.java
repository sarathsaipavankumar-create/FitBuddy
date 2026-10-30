package com.fitbuddy.repository;

import com.fitbuddy.entity.BmiRecord;
import com.fitbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BmiRecordRepository extends JpaRepository<BmiRecord, Long> {
    List<BmiRecord> findByUserOrderByRecordedAtDesc(User user);
    List<BmiRecord> findByUserIdOrderByRecordedAtDesc(Long userId);
}
