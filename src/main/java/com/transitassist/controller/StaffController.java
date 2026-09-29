package com.transitassist.controller;

import com.transitassist.entity.AssistanceRequest;
import com.transitassist.entity.Helper;
import com.transitassist.service.StaffService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping("/helpers")
    public Helper createHelper(
            @RequestBody Helper helper) {

        return staffService.createHelper(helper);
    }

    @GetMapping("/helpers")
    public List<Helper> getHelpers() {

        return staffService.getHelpers();
    }

    @PutMapping("/requests/{requestId}/assign/{helperId}")
    public AssistanceRequest assignHelper(
            @PathVariable Long requestId,
            @PathVariable Long helperId) {

        return staffService.assignHelper(
                requestId,
                helperId);
    }

    @PutMapping("/requests/{requestId}/complete")
    public AssistanceRequest completeRequest(
            @PathVariable Long requestId) {

        return staffService.completeRequest(requestId);
    }

    @GetMapping("/helpers/{helperId}/workload")
    public List<AssistanceRequest> getWorkload(
            @PathVariable Long helperId) {

        return staffService.getHelperWorkload(helperId);
    }
}