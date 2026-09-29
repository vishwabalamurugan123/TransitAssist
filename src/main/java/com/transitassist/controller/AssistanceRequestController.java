package com.transitassist.controller;

import com.transitassist.entity.AssistanceRequest;
import com.transitassist.service.AssistanceRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class AssistanceRequestController {

    private final AssistanceRequestService service;

    public AssistanceRequestController(
            AssistanceRequestService service) {
        this.service = service;
    }

    @PostMapping("/user/{userId}")
    public AssistanceRequest createRequest(
            @PathVariable Long userId,
            @RequestBody AssistanceRequest request) {

        return service.createRequest(userId, request);
    }

    @GetMapping
    public List<AssistanceRequest> getRequests() {
        return service.getAllRequests();
    }

    @GetMapping("/requested")
    public List<AssistanceRequest> getRequestedRequests() {
        return service.getRequestedRequests();
    }

    @GetMapping("/{id}")
    public AssistanceRequest getRequest(
            @PathVariable Long id) {

        return service.getRequest(id);
    }

    @DeleteMapping("/{id}/cancel")
    public String cancelRequest(
            @PathVariable Long id) {

        service.cancelRequest(id);

        return "Request cancelled successfully";
    }
}