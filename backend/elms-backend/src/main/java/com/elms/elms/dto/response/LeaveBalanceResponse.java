package com.elms.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceResponse {
    private Long id;
    private String leaveTypeName;
    private Integer year;
    private Integer totalDays;
    private Integer usedDays;
    private Integer remainingDays;
}