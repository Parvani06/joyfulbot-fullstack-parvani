package com.elms.elms.dto.request;

import com.elms.elms.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewLeaveRequest {

    @NotNull(message = "Status is required")
    private LeaveStatus status;

    private String remarks;
}