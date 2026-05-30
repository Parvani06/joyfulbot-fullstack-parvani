package com.elms.elms.controller;

import com.elms.elms.dto.response.LeaveApplicationResponse;
import com.elms.elms.entity.User;
import com.elms.elms.exception.ResourceNotFoundException;
import com.elms.elms.repository.UserRepository;
import com.elms.elms.service.LeaveApplicationService;
import com.elms.elms.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    private final LeaveApplicationService leaveApplicationService;
    private final UserRepository userRepository;

    @GetMapping("/team-leaves")
    public ResponseEntity<ApiResponse<Page<LeaveApplicationResponse>>> getTeamLeaves(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User manager = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.getTeamLeaves(manager.getId(), page, size)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        User manager = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.getAnalytics(manager.getId())));
    }
}