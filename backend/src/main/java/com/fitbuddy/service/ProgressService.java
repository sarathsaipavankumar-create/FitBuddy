package com.fitbuddy.service;

import com.fitbuddy.dto.ProgressLogRequest;
import com.fitbuddy.dto.ProgressRecordDto;
import com.fitbuddy.entity.ProgressRecord;
import com.fitbuddy.entity.User;
import com.fitbuddy.entity.UserProfile;
import com.fitbuddy.exception.ResourceNotFoundException;
import com.fitbuddy.repository.ProgressRecordRepository;
import com.fitbuddy.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final ProgressRecordRepository progressRepository;
    private final UserProfileRepository profileRepository;

    public ProgressService(ProgressRecordRepository progressRepository, UserProfileRepository profileRepository) {
        this.progressRepository = progressRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public ProgressRecordDto logProgress(User user, ProgressLogRequest req) {
        LocalDate date = req.getLogDate() != null ? req.getLogDate() : LocalDate.now();
        ProgressRecord record = new ProgressRecord(
                user,
                date,
                req.getWeight(),
                req.getWorkoutName(),
                req.getDurationMinutes(),
                req.getNotes()
        );
        record = progressRepository.save(record);

        // Also update user's profile weight if modern weight is supplied
        if (req.getWeight() != null && req.getWeight() > 0) {
            profileRepository.findByUser(user).ifPresent(profile -> {
                profile.setWeight(req.getWeight());
                if (profile.getHeight() != null && profile.getHeight() > 0) {
                    double hM = profile.getHeight() / 100.0;
                    double bmi = Math.round((profile.getWeight() / (hM * hM)) * 10.0) / 10.0;
                    profile.setBmi(bmi);
                    profile.setBmiCategory(UserProfile.determineBmiCategory(bmi));
                }
                profileRepository.save(profile);
            });
        }

        return toDto(record);
    }

    public List<ProgressRecordDto> getHistory(User user) {
        return progressRepository.findByUserOrderByLogDateDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteProgress(User user, Long id) {
        ProgressRecord record = progressRepository.findById(id)
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found with ID: " + id));
        progressRepository.delete(record);
    }

    public ProgressRecordDto toDto(ProgressRecord r) {
        if (r == null) return null;
        return new ProgressRecordDto(
                r.getId(),
                r.getLogDate(),
                r.getWeight(),
                r.getWorkoutName(),
                r.getDurationMinutes(),
                r.getNotes(),
                r.getCreatedAt()
        );
    }
}
