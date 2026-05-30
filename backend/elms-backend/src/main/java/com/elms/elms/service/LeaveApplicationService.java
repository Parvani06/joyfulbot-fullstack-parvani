package com.elms.elms.service;

import com.elms.elms.dto.request.LeaveApplicationRequest;
import com.elms.elms.dto.request.ReviewLeaveRequest;
import com.elms.elms.dto.response.LeaveApplicationResponse;
import com.elms.elms.entity.*;
import com.elms.elms.exception.BadRequestException;
import com.elms.elms.exception.ResourceNotFoundException;
import com.elms.elms.exception.UnauthorizedException;
import com.elms.elms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class LeaveApplicationService {

    private final LeaveApplicationRepository leaveApplicationRepository;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    @Transactional
    public LeaveApplicationResponse applyLeave(LeaveApplicationRequest request, String employeeEmail) {
        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave type not found with id: " + request.getLeaveTypeId()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        int totalDays = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (request.getStartDate().isBefore(java.time.LocalDate.now())) {
            throw new BadRequestException("Start date cannot be in the past");
        }

        int currentYear = request.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByUserIdAndLeaveTypeIdAndYear(employee.getId(), leaveType.getId(), currentYear)
                .orElseThrow(() -> new BadRequestException(
                        "No leave balance found for this leave type in year " + currentYear));

        if (balance.getRemainingDays() < totalDays) {
            throw new BadRequestException("Insufficient leave balance. Available: "
                    + balance.getRemainingDays() + " days");
        }

        LeaveApplication application = LeaveApplication.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays(totalDays)
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        leaveApplicationRepository.save(application);
        System.out.println("[EMAIL NOTIFICATION] Leave application submitted by " + employee.getEmail());
        return mapToResponse(application);
    }

    public List<LeaveApplicationResponse> getAllApplications() {
        return leaveApplicationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveApplicationResponse> getMyApplications(String employeeEmail) {
        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return leaveApplicationRepository.findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveApplicationResponse reviewLeave(Long applicationId,
                                                ReviewLeaveRequest request,
                                                String managerEmail) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave application not found with id: " + applicationId));

        if (application.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only PENDING applications can be reviewed");
        }

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        application.setStatus(request.getStatus());
        application.setReviewedBy(manager);
        application.setReviewedAt(LocalDateTime.now());
        application.setRemarks(request.getRemarks());

        if (request.getStatus() == LeaveStatus.APPROVED) {
            LeaveBalance balance = leaveBalanceRepository
                    .findByUserIdAndLeaveTypeIdAndYear(
                            application.getEmployee().getId(),
                            application.getLeaveType().getId(),
                            application.getStartDate().getYear())
                    .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found"));

            balance.setUsedDays(balance.getUsedDays() + application.getTotalDays());
            balance.setRemainingDays(balance.getRemainingDays() - application.getTotalDays());
            leaveBalanceRepository.save(balance);
        }

        leaveApplicationRepository.save(application);
        System.out.println("[EMAIL NOTIFICATION] Leave " + request.getStatus() + " for " + application.getEmployee().getEmail());
        return mapToResponse(application);
    }

    private LeaveApplicationResponse mapToResponse(LeaveApplication application) {
        return LeaveApplicationResponse.builder()
                .id(application.getId())
                .employeeName(application.getEmployee().getName())
                .leaveTypeName(application.getLeaveType().getName())
                .startDate(application.getStartDate())
                .endDate(application.getEndDate())
                .totalDays(application.getTotalDays())
                .reason(application.getReason())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .reviewedAt(application.getReviewedAt())
                .remarks(application.getRemarks())
                .build();
    }

    public void cancelLeave(Long applicationId, String employeeEmail) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave application not found with id: " + applicationId));
        if (!application.getEmployee().getEmail().equals(employeeEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this leave");
        }
        if (application.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only PENDING leaves can be cancelled");
        }
        leaveApplicationRepository.delete(application);
    }

    public Page<LeaveApplicationResponse> getTeamLeaves(Long managerId, int page, int size) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        Long departmentId = manager.getDepartment().getId();
        return leaveApplicationRepository
                .findByEmployee_Department_Id(departmentId, PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    public Map<String, Long> getAnalytics(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        Long departmentId = manager.getDepartment().getId();
        List<LeaveApplication> applications = leaveApplicationRepository
                .findByEmployee_Department_Id(departmentId, Pageable.unpaged())
                .getContent();
        Map<String, Long> analytics = new HashMap<>();
        analytics.put("PENDING", applications.stream()
                .filter(a -> a.getStatus() == LeaveStatus.PENDING).count());
        analytics.put("APPROVED", applications.stream()
                .filter(a -> a.getStatus() == LeaveStatus.APPROVED).count());
        analytics.put("REJECTED", applications.stream()
                .filter(a -> a.getStatus() == LeaveStatus.REJECTED).count());
        analytics.put("TOTAL", (long) applications.size());
        return analytics;
    }
}