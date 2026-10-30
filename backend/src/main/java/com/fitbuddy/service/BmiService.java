package com.fitbuddy.service;

import com.fitbuddy.dto.BmiLogRequest;
import com.fitbuddy.dto.BmiRecordDto;
import com.fitbuddy.entity.BmiRecord;
import com.fitbuddy.entity.User;
import com.fitbuddy.entity.UserProfile;
import com.fitbuddy.repository.BmiRecordRepository;
import com.fitbuddy.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BmiService {

    private final BmiRecordRepository bmiRepository;
    private final UserProfileRepository profileRepository;

    public BmiService(BmiRecordRepository bmiRepository, UserProfileRepository profileRepository) {
        this.bmiRepository = bmiRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public BmiRecordDto logBmi(User user, BmiLogRequest req) {
        double height = req.getHeight();
        double weight = req.getWeight();
        double hM = height / 100.0;
        double bmiVal = Math.round((weight / (hM * hM)) * 10.0) / 10.0;
        String category = UserProfile.determineBmiCategory(bmiVal);

        BmiRecord record = new BmiRecord(user, height, weight, bmiVal, category);
        record = bmiRepository.save(record);

        // Update profile
        profileRepository.findByUser(user).ifPresent(profile -> {
            profile.setHeight(height);
            profile.setWeight(weight);
            profile.setBmi(bmiVal);
            profile.setBmiCategory(category);
            profileRepository.save(profile);
        });

        return toDto(record);
    }

    public List<BmiRecordDto> getHistory(User user) {
        return bmiRepository.findByUserOrderByRecordedAtDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public BmiRecordDto toDto(BmiRecord b) {
        if (b == null) return null;
        return new BmiRecordDto(
                b.getId(),
                b.getHeight(),
                b.getWeight(),
                b.getBmiValue(),
                b.getBmiCategory(),
                b.getRecordedAt()
        );
    }
}
