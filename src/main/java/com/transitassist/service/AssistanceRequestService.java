package com.transitassist.service;

import com.transitassist.entity.*;
import com.transitassist.repository.AssistanceRequestRepository;
import com.transitassist.repository.HelperRepository;
import com.transitassist.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistanceRequestService {

    private final AssistanceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final HelperRepository helperRepository;

    public AssistanceRequestService(
            AssistanceRequestRepository requestRepository,
            UserRepository userRepository,
            HelperRepository helperRepository) {

        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.helperRepository = helperRepository;
    }

    public AssistanceRequest createRequest(
            Long userId,
            AssistanceRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new RuntimeException(
                    "Start time must be before end time");
        }

        request.setUser(user);
        request.setStatus(RequestStatus.REQUESTED);

        return requestRepository.save(request);
    }

    public List<AssistanceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<AssistanceRequest> getRequestedRequests() {
        return requestRepository.findByStatus(
                RequestStatus.REQUESTED);
    }

    public AssistanceRequest getRequest(Long id) {

        return requestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found"));
    }

    public void cancelRequest(Long id) {

        AssistanceRequest request = getRequest(id);

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed request cannot be cancelled");
        }

        request.setStatus(RequestStatus.CANCELLED);

        requestRepository.save(request);
    }
}