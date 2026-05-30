package com.elms.elms.service;

import com.elms.elms.dto.response.LeaveTypeResponse;
import com.elms.elms.entity.LeaveType;
import com.elms.elms.exception.ResourceNotFoundException;
import com.elms.elms.repository.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;

    public List<LeaveTypeResponse> getAllLeaveTypes() {
        return leaveTypeRepository.findAll()
                .stream()
                .map(this::mapToLeaveTypeResponse)
                .collect(Collectors.toList());
    }

    public LeaveTypeResponse getLeaveTypeById(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave type not found with id: " + id));
        return mapToLeaveTypeResponse(leaveType);
    }

    private LeaveTypeResponse mapToLeaveTypeResponse(LeaveType leaveType) {
        return LeaveTypeResponse.builder()
                .id(leaveType.getId())
                .name(leaveType.getName())
                .maxDaysPerYear(leaveType.getMaxDaysPerYear())
                .description(leaveType.getDescription())
                .build();
    }
}