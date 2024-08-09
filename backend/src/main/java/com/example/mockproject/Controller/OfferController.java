package com.example.mockproject.Controller;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Dto.OfferDto;
import com.example.mockproject.Dto.UserDto;
import com.example.mockproject.Service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping("/create")
    public ResponseEntity<OfferDto> submitOffer(@RequestBody OfferDto offerDTO) {
        offerService.saveOffer(offerDTO);
        return ResponseEntity.ok(offerDTO);
    }

    @GetMapping
    public ResponseEntity<?> getAllOffers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<OfferDto> offerDtos = offerService.getAllOffers(page, size);
            return ResponseEntity.ok(offerDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    //
    // @PostMapping("/edit/{id}")
    // public ResponseEntity<?> updateOffer(@PathVariable int id, OfferDto offerDTO)
    // {
    // offerDTO.setId(id);
    // offerService.saveOffer(offerDTO);
    // return "redirect:/offers/all";
    // }
    @PutMapping("/update/{id}")
    public ResponseEntity<OfferDto> updateJob(@RequestBody OfferDto offerDto, @PathVariable int id) {
        offerDto.setId(id);
        offerService.update(offerDto);
        return ResponseEntity.ok(offerDto);
    }
    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewOfferDetails(@PathVariable int id) {
        OfferDto offerDTO = offerService.getOfferById(id);
        return ResponseEntity.ok(offerDTO);
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<OfferDto>> getOffersByCandidate(@PathVariable int candidateId) {
        List<OfferDto> offerDtos = offerService.getOffersByCandidate(candidateId);
        return ResponseEntity.ok(offerDtos);
    }
}
