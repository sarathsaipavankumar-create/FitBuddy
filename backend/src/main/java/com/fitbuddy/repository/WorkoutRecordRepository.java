package com.fitbuddy.repository;

import com.fitbuddy.entity.User;
import com.fitbuddy.entity.WorkoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRecordRepository extends JpaRepository<WorkoutRecord, Long> {
    List<WorkoutRecord> findByUserOrderByCompletedAtDesc(User user);
    List<WorkoutRecord> findByUserIdOrderByCompletedAtDesc(Long userId);
    long countByUser(User user);

    @Query("SELECT COALESCE(SUM(w.durationMinutes), 0) FROM WorkoutRecord w WHERE w.user = :user")
    int sumDurationMinutesByUser(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0) FROM WorkoutRecord w WHERE w.user = :user")
    int sumCaloriesBurnedByUser(@Param("user") User user);
}
