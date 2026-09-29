package com.transitassist.service;

import com.transitassist.entity.*;
import com.transitassist.repository.AssistanceRequestRepository;
import com.transitassist.repository.HelperRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final AssistanceRequestRepository requestRepository;
    private final HelperRepository helperRepository;

    public StaffService(
            AssistanceRequestRepository requestRepository,
            HelperRepository helperRepository) {

        this.requestRepository = requestRepository;
        this.helperRepository = helperRepository;
    }

    public AssistanceRequest assignHelper(
            Long requestId,
            Long helperId) {

        AssistanceRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"));

        Helper helper =
                helperRepository.findById(helperId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Helper not found"));

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed request cannot be reassigned");
        }

        if (!helper.isAvailable()) {
            throw new RuntimeException(
                    "Helper is not available");
        }

        List<AssistanceRequest> helperRequests =
                requestRepository.findByHelperId(helperId);

        for (AssistanceRequest existing : helperRequests) {

            if (existing.getStatus() == RequestStatus.CANCELLED) {
                continue;
            }

            if (existing.getId().equals(requestId)) {
                continue;
            }

            boolean overlap =
                    request.getStartTime()
                            .isBefore(existing.getEndTime())
                            &&
                            request.getEndTime()
                                    .isAfter(existing.getStartTime());

            if (overlap) {
                throw new RuntimeException(
                        "Helper already has another request "
                                + "during this time");
            }
        }

        request.setHelper(helper);
        request.setStatus(RequestStatus.ASSIGNED);

        return requestRepository.save(request);
    }

    public AssistanceRequest completeRequest(Long requestId) {

        AssistanceRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"));

        if (request.getStatus() != RequestStatus.ASSIGNED) {
            throw new RuntimeException(
                    "Only assigned requests can be completed");
        }

        request.setStatus(RequestStatus.COMPLETED);

        return requestRepository.save(request);
    }

    public List<AssistanceRequest> getHelperWorkload(
            Long helperId) {

        return requestRepository.findByHelperId(helperId);
    }

    public Helper createHelper(Helper helper) {

        return helperRepository.save(helper);
    }

    public List<Helper> getHelpers() {

        return helperRepository.findAll();
    }
}