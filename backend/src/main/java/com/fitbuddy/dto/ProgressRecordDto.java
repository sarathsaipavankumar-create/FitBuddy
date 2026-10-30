package com.fitbuddy.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProgressRecordDto {

    private Long id;
    private LocalDate logDate;
    private Double weight;
    private String workoutName;
    private Integer durationMinutes;
    private String notes;
    private LocalDateTime createdAt;

    public ProgressRecordDto() {
    }

    public ProgressRecordDto(Long id, LocalDate logDate, Double weight, String workoutName, Integer durationMinutes, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.logDate = logDate;
        this.weight = weight;
        this.workoutName = workoutName;
        this.durationMinutes = durationMinutes;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
