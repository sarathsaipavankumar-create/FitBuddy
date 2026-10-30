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
@Table(name = "bmi_records")
public class BmiRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double height; // in cm

    @Column(nullable = false)
    private Double weight; // in kg

    @Column(name = "bmi_value", nullable = false)
    private Double bmiValue;

    @Column(name = "bmi_category", length = 50)
    private String bmiCategory;

    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    public BmiRecord() {
    }

    public BmiRecord(User user, Double height, Double weight, Double bmiValue, String bmiCategory) {
        this.user = user;
        this.height = height;
        this.weight = weight;
        this.bmiValue = bmiValue;
        this.bmiCategory = bmiCategory;
    }

    @PrePersist
    protected void onCreate() {
        this.recordedAt = LocalDateTime.now();
        if (this.bmiValue == null && this.height != null && this.height > 0 && this.weight != null && this.weight > 0) {
            double hMeters = this.height / 100.0;
            this.bmiValue = Math.round((this.weight / (hMeters * hMeters)) * 10.0) / 10.0;
            this.bmiCategory = UserProfile.determineBmiCategory(this.bmiValue);
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
