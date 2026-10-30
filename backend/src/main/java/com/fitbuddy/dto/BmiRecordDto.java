package com.fitbuddy.dto;

import java.time.LocalDateTime;

public class BmiRecordDto {

    private Long id;
    private Double height;
    private Double weight;
    private Double bmiValue;
    private String bmiCategory;
    private LocalDateTime recordedAt;

    public BmiRecordDto() {
    }

    public BmiRecordDto(Long id, Double height, Double weight, Double bmiValue, String bmiCategory, LocalDateTime recordedAt) {
        this.id = id;
        this.height = height;
        this.weight = weight;
        this.bmiValue = bmiValue;
        this.bmiCategory = bmiCategory;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getBmiValue() {
        return bmiValue;
    }

    public void setBmiValue(Double bmiValue) {
        this.bmiValue = bmiValue;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
