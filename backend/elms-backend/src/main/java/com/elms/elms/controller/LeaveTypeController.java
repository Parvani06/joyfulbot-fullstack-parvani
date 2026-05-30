package com.elms.elms.controller;

import com.elms.elms.dto.response.LeaveTypeResponse;
import com.elms.elms.service.LeaveTypeService;
import com.elms.elms.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveTypeResponse>>> getAllLeaveTypes() {
        return ResponseEntity.ok(ApiResponse.success(leaveTypeService.getAllLeaveTypes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> getLeaveTypeById(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leaveTypeService.getLeaveTypeById(id)));
    }
}