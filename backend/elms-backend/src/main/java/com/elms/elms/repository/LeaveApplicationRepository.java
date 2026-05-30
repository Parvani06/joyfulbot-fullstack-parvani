package com.elms.elms.repository;

import com.elms.elms.entity.LeaveApplication;
import com.elms.elms.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {
    List<LeaveApplication> findByEmployeeId(Long employeeId);
    List<LeaveApplication> findByStatus(LeaveStatus status);
    List<LeaveApplication> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);
    Page<LeaveApplication> findByEmployeeId(Long employeeId, Pageable pageable);
    Page<LeaveApplication> findByEmployee_Department_Id(Long departmentId, Pageable pageable);
}