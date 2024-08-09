package com.example.mockproject.Service.Impl;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Dto.OfferDto;
import com.example.mockproject.Dto.UserDto;
import com.example.mockproject.Entity.Candidate;
import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.Offer;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.CandidateStatus;
import com.example.mockproject.Repository.CandidateRepository;
import com.example.mockproject.Repository.OfferRepository;
import com.example.mockproject.Service.OfferService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OfferServiceImpl implements OfferService {
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    public OfferServiceImpl(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    @Override
    public void saveOffer(OfferDto offerDto) {
        ModelMapper modelMapper = new ModelMapper();
        Offer offer = modelMapper.map(offerDto, Offer.class);
        offerRepository.save(offer);
        int id=offerDto.getCandidateOffer().getId();
        Optional<Candidate> candidateOptional=candidateRepository.findById(id);
        Candidate candidate = candidateOptional.get();
        candidate.setStatus(CandidateStatus.WAITING_FOR_APPROVAL);
        candidateRepository.save(candidate);
    }

    @Override
    public Page<OfferDto> getAllOffers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Offer> offersPage;
        offersPage = offerRepository.findAll(pageable);
        Page<OfferDto> offerDtos = offersPage.map(this::convertToDTO);
        return offerDtos;
    }

    @Override
    public OfferDto getOfferById(int id) {
        Optional<Offer> offerOpt = offerRepository.findById(id);
        return offerOpt.map(this::convertToDTO).orElse(null);
    }

    @Override
    public void update(OfferDto offerDto) {
        ModelMapper modelMapper = new ModelMapper();
        Offer offer = modelMapper.map(offerDto, Offer.class);
        offerRepository.save(offer);
        int id=offerDto.getCandidateOffer().getId();
        Optional<Candidate> candidateOptional=candidateRepository.findById(id);
        Candidate candidate = candidateOptional.get();
        if (offerDto.getStatus().toString().equalsIgnoreCase("APPROVED")){
            candidate.setStatus(CandidateStatus.APPROVED_OFFER);
        }
        else if (offerDto.getStatus().toString().equalsIgnoreCase("REJECTED")){
            candidate.setStatus(CandidateStatus.REJECTED_OFFER);
        }else if (offerDto.getStatus().toString().equalsIgnoreCase("WAITING_FOR_RESPONSE")){
            candidate.setStatus(CandidateStatus.WAITING_FOR_RESPONSE);
        }else if (offerDto.getStatus().toString().equalsIgnoreCase("ACCEPTED")){
            candidate.setStatus(CandidateStatus.ACCEPTED_OFFER);
        }else if (offerDto.getStatus().toString().equalsIgnoreCase("DECLINED")){
            candidate.setStatus(CandidateStatus.DECLINED_OFFER);
        }
        else if (offerDto.getStatus().toString().equalsIgnoreCase("CANCELLED")){
            candidate.setStatus(CandidateStatus.CANCELLED_OFFER);
        }
        candidateRepository.save(candidate);
    }

    @Override
    public List<OfferDto> getOffersByCandidate(int candidateId) {
        List<Offer> offers = offerRepository.findByCandidateOfferId(candidateId);
        return offers.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private OfferDto convertToDTO(Offer offer) {
        OfferDto offerDto = new OfferDto();
        offerDto.setId(offer.getId());
        offerDto.setContractType(offer.getContractType());
        offerDto.setPosition(offer.getPosition());
        offerDto.setLevel(offer.getLevel());
        offerDto.setRejectNote(offer.getRejectNote());
        offerDto.setContractStart(offer.getContractStart());
        offerDto.setContractEnd(offer.getContractEnd());
        offerDto.setDepartment(offer.getDepartment());
        offerDto.setDueDate(offer.getDueDate());
        offerDto.setBasicSalary(offer.getBasicSalary());
        offerDto.setNote(offer.getNote());
        offerDto.setStatus(offer.getStatus());
        offerDto.setApprover(offer.getApprover());
        offerDto.setCandidateOffer(offer.getCandidateOffer());
        offerDto.setInterview(offer.getInterview());
        offerDto.setJob(offer.getInterview().getJob());
        return offerDto;
    }

    private Offer convertToEntity(OfferDto offerDto) {
        Offer offer = new Offer();
        offer.setId(offerDto.getId());
        offer.setContractType(offerDto.getContractType());
        offer.setPosition(offerDto.getPosition());
        offer.setLevel(offerDto.getLevel());
        offer.setContractStart(offerDto.getContractStart());
        offer.setContractEnd(offerDto.getContractEnd());
        offer.setDepartment(offerDto.getDepartment());
        offer.setDueDate(offerDto.getDueDate());
        offer.setBasicSalary(offerDto.getBasicSalary());
        offer.setNote(offerDto.getNote());
        offer.setStatus(offerDto.getStatus());
        offer.setInterview(offerDto.getInterview());
        offer.setApprover(offerDto.getApprover());
        offer.setRecruiter(offerDto.getRecruiter());
        offer.setCandidateOffer(offerDto.getCandidateOffer());
        return offer;
    }
}
