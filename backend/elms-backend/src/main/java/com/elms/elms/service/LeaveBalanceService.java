package com.elms.elms.service;

import com.elms.elms.dto.response.LeaveBalanceResponse;
import com.elms.elms.entity.User;
import com.elms.elms.exception.ResourceNotFoundException;
import com.elms.elms.repository.LeaveBalanceRepository;
import com.elms.elms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    public List<LeaveBalanceResponse> getMyBalances(String employeeEmail, int year) {
        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return leaveBalanceRepository.findByUserIdAndYear(employee.getId(), year)
                .stream()
                .map(balance -> LeaveBalanceResponse.builder()
                        .id(balance.getId())
                        .leaveTypeName(balance.getLeaveType().getName())
                        .year(balance.getYear())
                        .totalDays(balance.getTotalDays())
                        .usedDays(balance.getUsedDays())
                        .remainingDays(balance.getRemainingDays())
                        .build())
                .collect(Collectors.toList());
    }

    public List<LeaveBalanceResponse> getBalancesByUserId(Long userId, int year) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));
        return leaveBalanceRepository.findByUserIdAndYear(userId, year)
                .stream()
                .map(balance -> LeaveBalanceResponse.builder()
                        .id(balance.getId())
                        .leaveTypeName(balance.getLeaveType().getName())
                        .year(balance.getYear())
                        .totalDays(balance.getTotalDays())
                        .usedDays(balance.getUsedDays())
                        .remainingDays(balance.getRemainingDays())
                        .build())
                .collect(Collectors.toList());
    }
}