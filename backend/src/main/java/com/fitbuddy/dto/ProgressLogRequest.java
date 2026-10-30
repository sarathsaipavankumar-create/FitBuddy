package com.fitbuddy.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class ProgressLogRequest {

    private LocalDate logDate;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be greater than 0")
    private Double weight;

    private String workoutName;
    private Integer durationMinutes;
    private String notes;

    public ProgressLogRequest() {
    }

    public ProgressLogRequest(LocalDate logDate, Double weight, String workoutName, Integer durationMinutes, String notes) {
        this.logDate = logDate;
        this.weight = weight;
        this.workoutName = workoutName;
        this.durationMinutes = durationMinutes;
        this.notes = notes;
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
}
