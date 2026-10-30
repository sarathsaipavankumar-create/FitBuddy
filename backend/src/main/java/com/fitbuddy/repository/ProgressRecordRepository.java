package com.fitbuddy.repository;

import com.fitbuddy.entity.ProgressRecord;
import com.fitbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRecordRepository extends JpaRepository<ProgressRecord, Long> {
    List<ProgressRecord> findByUserOrderByLogDateDesc(User user);
    List<ProgressRecord> findByUserIdOrderByLogDateDesc(Long userId);
    long countByUser(User user);
}
