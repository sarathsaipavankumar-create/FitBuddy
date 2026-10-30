package com.fitbuddy.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_records")
public class WorkoutRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "workout_name", nullable = false, length = 150)
    private String workoutName;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "exercises_completed")
    private Integer exercisesCompleted;

    @Column(name = "sets_completed")
    private Integer setsCompleted;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    @Column(length = 500)
    private String notes;

    public WorkoutRecord() {
    }

    public WorkoutRecord(User user, String workoutName, Integer durationMinutes, Integer exercisesCompleted, Integer setsCompleted, Integer caloriesBurned, LocalDateTime completedAt, String notes) {
        this.user = user;
        this.workoutName = workoutName;
        this.durationMinutes = durationMinutes;
        this.exercisesCompleted = exercisesCompleted;
        this.setsCompleted = setsCompleted;
        this.caloriesBurned = caloriesBurned;
        this.completedAt = completedAt != null ? completedAt : LocalDateTime.now();
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        if (this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
        if (this.caloriesBurned == null && this.durationMinutes != null) {
            // Standard approximate burn rate: ~7.5 kcal/min for calisthenics/HIIT
            this.caloriesBurned = (int) Math.round(this.durationMinutes * 7.5);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getWorkoutName() {
        return workoutName;
    }

    public void setWorkoutName(String workoutName) {
        this.workoutName = workoutName;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getExercisesCompleted() {
        return exercisesCompleted;
    }

    public void setExercisesCompleted(Integer exercisesCompleted) {
        this.exercisesCompleted = exercisesCompleted;
    }

    public Integer getSetsCompleted() {
        return setsCompleted;
    }

    public void setSetsCompleted(Integer setsCompleted) {
        this.setsCompleted = setsCompleted;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
