package com.example.mockproject.Service;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Dto.OfferDto;
import com.example.mockproject.Dto.UserDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OfferService {
    void saveOffer(OfferDto offerDto);

    Page<OfferDto> getAllOffers(int page, int size);

    OfferDto getOfferById(int id);
    void update(OfferDto offerDto);

    List<OfferDto> getOffersByCandidate(int candidateId);
}
