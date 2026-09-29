package com.transitassist.repository;

import com.transitassist.entity.AssistanceRequest;
import com.transitassist.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssistanceRequestRepository
        extends JpaRepository<AssistanceRequest, Long> {

    List<AssistanceRequest> findByStatus(RequestStatus status);

    List<AssistanceRequest> findByHelperId(Long helperId);
}