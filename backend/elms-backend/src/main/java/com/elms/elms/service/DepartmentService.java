package com.elms.elms.service;

import com.elms.elms.dto.response.DepartmentResponse;
import com.elms.elms.entity.Department;
import com.elms.elms.exception.ResourceNotFoundException;
import com.elms.elms.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::mapToDepartmentResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + id));
        return mapToDepartmentResponse(department);
    }

    public DepartmentResponse createDepartment(String name) {
        Department department = Department.builder()
                .name(name)
                .build();
        departmentRepository.save(department);
        return mapToDepartmentResponse(department);
    }

    private DepartmentResponse mapToDepartmentResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .managerName(department.getManager() != null ?
                        department.getManager().getName() : null)
                .build();
    }
}