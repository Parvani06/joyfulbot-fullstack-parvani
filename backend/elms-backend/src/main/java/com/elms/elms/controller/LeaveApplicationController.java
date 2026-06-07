package com.elms.elms.controller;

import com.elms.elms.dto.request.LeaveApplicationRequest;
import com.elms.elms.dto.request.ReviewLeaveRequest;
import com.elms.elms.dto.response.LeaveApplicationResponse;
import com.elms.elms.service.LeaveApplicationService;
import com.elms.elms.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-applications")
@RequiredArgsConstructor
public class LeaveApplicationController {

    private final LeaveApplicationService leaveApplicationService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse<LeaveApplicationResponse>> applyLeave(
            @Valid @RequestBody LeaveApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.applyLeave(request, userDetails.getUsername())));
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<LeaveApplicationResponse>>> getAllApplications() {
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.getAllApplications()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.getMyApplications(userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse<LeaveApplicationResponse>> getLeaveById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.getLeaveById(id)));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<LeaveApplicationResponse>> reviewLeave(
            @PathVariable Long id,
            @Valid @RequestBody ReviewLeaveRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveApplicationService.reviewLeave(id, request, userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        leaveApplicationService.cancelLeave(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Leave cancelled successfully", null));
    }
}