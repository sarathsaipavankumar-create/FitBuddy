package com.fitbuddy.controller;

import com.fitbuddy.dto.ApiResponse;
import com.fitbuddy.dto.ProfileDto;
import com.fitbuddy.entity.User;
import com.fitbuddy.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserProfileService userProfileService;

    public UserController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> getProfile(@AuthenticationPrincipal User currentUser) {
        ProfileDto profile = userProfileService.getProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ProfileDto profileDto) {
        ProfileDto updated = userProfileService.updateProfile(currentUser, profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
