package com.elms.elms.controller;

import com.elms.elms.dto.response.LeaveBalanceResponse;
import com.elms.elms.service.LeaveBalanceService;
import com.elms.elms.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
@RequiredArgsConstructor
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getMyBalances(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveBalanceService.getMyBalances(userDetails.getUsername(), year)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getBalancesByUserId(
            @PathVariable Long userId,
            @RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveBalanceService.getBalancesByUserId(userId, year)));
    }
}