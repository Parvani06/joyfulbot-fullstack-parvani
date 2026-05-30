package com.elms.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveTypeResponse {
    private Long id;
    private String name;
    private Integer maxDaysPerYear;
    private String description;
}