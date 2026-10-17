package com.ahmedesawy.floria.occasion;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.common.storage.FileStorageService;
import com.ahmedesawy.floria.occasion.dto.request.OccasionRequest;
import com.ahmedesawy.floria.occasion.dto.response.OccasionResponse;
import com.ahmedesawy.floria.occasion.dto.response.OccasionSummaryResponse;
import com.ahmedesawy.floria.occasion.dto.response.TrashOccasionResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OccasionService {

    public final OccasionRepository occasionRepository;
    public final FileStorageService fileStorageService;

    // ---- QUIRES --------------------------------------------------
    public List<OccasionResponse> getActiveOccasions() {
        return occasionRepository.findAllByDeletedAtIsNullOrderByUpdatedAtDesc()
                .stream()
                .map(OccasionMapper::toResponse)
                .toList();
    }

    public List<OccasionSummaryResponse> getActiveOccasionsSummary() {
        return occasionRepository.findAllByDeletedAtIsNullOrderByCreatedAtDesc()
                .stream()
                .map(OccasionMapper::toSummaryResponse)
                .toList();
    }

    public List<TrashOccasionResponse> getTrashOccasions() {
        return occasionRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc()
                .stream()
                .map(OccasionMapper::toTrashResponse)
                .toList();
    }

    public OccasionResponse getOccasionById(Integer id) {
        Occasion existing = occasionRepository.findByIdOrThrow(id);
        return OccasionMapper.toResponse(existing);
    }

    // ---- CREATE
    // ----------------------------------------------------------------------
    @Transactional
    public OccasionResponse create(OccasionRequest request) {

        String nameEn = request.getNameEn().trim();
        String nameAr = request.getNameAr().trim();

        if (occasionRepository.existsByNameEnIgnoreCase(nameEn))
            throw new ResourceAlreadyExistsException("The name of occasion in english is alerady exist.");

        if (occasionRepository.existsByNameArIgnoreCase(nameAr))
            throw new ResourceAlreadyExistsException("The name of occasion in arabic is alerady exist.");

        Occasion newOccasion = new Occasion();
        newOccasion.setNameEn(nameEn);
        newOccasion.setNameAr(nameAr);

        if (request.getImage() != null && !request.getImage().isEmpty())
            newOccasion.setImageUrl(fileStorageService.uploadImage(request.getImage(), "occasions"));

        return OccasionMapper.toResponse(occasionRepository.save(newOccasion));
    }

    // ---- UPDATE
    // ----------------------------------------------------------------------
    @Transactional
    public OccasionResponse update(Integer id, OccasionRequest request) {
        Occasion existing = occasionRepository.findByIdOrThrow(id);

        String nameEn = request.getNameEn().trim();
        String nameAr = request.getNameAr().trim();

        if (occasionRepository.existsByNameEnIgnoreCaseAndIdNot(nameEn, id))
            throw new ResourceAlreadyExistsException("The English occasion name '" + nameEn + "' already exists");

        if (occasionRepository.existsByNameArIgnoreCaseAndIdNot(nameAr, id))
            throw new ResourceAlreadyExistsException("The Arabic occasion name '" + nameAr + "' already exists");

        existing.setNameEn(nameEn);
        existing.setNameAr(nameAr);

        if (request.getImage() != null && !request.getImage().isEmpty()) {

            if (existing.getImageUrl() != null) {
                try {
                    fileStorageService.deleteFile("occasions/" + existing.getImageUrl());
                } catch (Exception e) {
                }
            }

            existing.setImageUrl(fileStorageService.uploadImage(request.getImage(), "occasions"));
        }

        return OccasionMapper.toResponse(occasionRepository.save(existing));
    }

    // ---- SINGLE OPERATIONS
    // ------------------------------------------------------------------------------------
    public void restore(Integer id) {
        Occasion occasion = occasionRepository.findByIdOrThrow(id);
        occasion.setDeletedAt(null);
        occasionRepository.save(occasion);
    }

    public void softDelete(Integer id) {
        Occasion existing = occasionRepository.findByIdOrThrow(id);
        existing.setDeletedAt(LocalDateTime.now());
        occasionRepository.save(existing);
    }

    public void hardDelete(Integer id) {
        Occasion existing = occasionRepository.findByIdOrThrow(id);

        if (existing.getImageUrl() != null) {
            try {
                fileStorageService.deleteFile("occasions/" + existing.getImageUrl());
            } catch (Exception e) {
            }
        }
        occasionRepository.delete(existing);
    }

    // ---- BULK OPERATIONS
    // ------------------------------------------------------------------------------------
    @Transactional
    public void restoreBulk(List<Integer> ids) {
        occasionRepository.restoreBulk(ids);
    }

    @Transactional
    public void hardDeleteBulk(List<Integer> ids) {
        List<Occasion> occaions = occasionRepository.findAllById(ids);
        if (occaions.isEmpty())
            throw new NotFoundException("No Occasions Found!");
        occasionRepository.deleteAll(occaions);
    }

}
