package com.fitbuddy.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BmiLogRequest {

    @NotNull(message = "Height is required")
    @Positive(message = "Height must be greater than 0")
    private Double height; // cm

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be greater than 0")
    private Double weight; // kg

    public BmiLogRequest() {
    }

    public BmiLogRequest(Double height, Double weight) {
        this.height = height;
        this.weight = weight;
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
}
