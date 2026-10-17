package com.ahmedesawy.floria.city;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.city.dto.CityRequest;
import com.ahmedesawy.floria.city.dto.CityResponse;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.vector.VectorIndexService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    private final VectorIndexService vectorIndexService;

    // ---- QUIRES ---------------------------------------------------------
    public List<City> getAllCities() {
        return cityRepository.findByOrderByCreatedAtDesc();
    }

    public List<CityResponse> getAvailableCities() {
        return cityRepository.findByAvailableTrue()
                .stream()
                .map(CityMapper::toResponse)
                .toList();
    }

    public City getCityById(Integer id) {
        return cityRepository.findByIdOrThrow(id, "City");
    }

    // ---- CREATE --------------------------------------------------
    @Transactional
    public String addCity(CityRequest request) {

        String nameEn = request.getNameEn().trim();
        String nameAr = request.getNameAr().trim();

        if (cityRepository.existsByNameEnIgnoreCase(nameEn))
            throw new ResourceAlreadyExistsException("The name of city in english '" + nameEn + "' already exists");

        if (cityRepository.existsByNameArIgnoreCase(nameAr))
            throw new ResourceAlreadyExistsException("The name of city in arabic '" + nameAr + "' already exists");

        City city = new City(
                nameEn,
                nameAr,
                request.getDeliveryPrice(),
                request.getAvailable());

        City saved = cityRepository.save(city);
        vectorIndexService.upsertCity(saved);
        return "City added successfully";
    }

    // ---- UPDATE -----------------------------------------------
    @Transactional
    public City updateCity(Integer id, CityRequest request) {
        City city = cityRepository.findByIdOrThrow(id, "City");

        String nameEn = request.getNameEn().trim();
        String nameAr = request.getNameAr().trim();

        if (cityRepository.existsByNameEnIgnoreCaseAndIdNot(nameEn, id))
            throw new ResourceAlreadyExistsException("The name of city in english '" + nameEn + "' already exists");

        if (cityRepository.existsByNameArIgnoreCaseAndIdNot(nameAr, id))
            throw new ResourceAlreadyExistsException("The name of city in arabic '" + nameAr + "' already exists");

        city.setNameEn(nameEn);
        city.setNameAr(nameAr);
        city.setDeliveryPrice(request.getDeliveryPrice());
        city.setAvailable(request.getAvailable());

        City saved = cityRepository.save(city);
        vectorIndexService.upsertCity(saved);
        return saved;
    }

    // ---- DELETE -------------------------------------------------------------
    @Transactional
    public void deletePermanently(Integer id) {
        if (!cityRepository.existsById(id))
            throw new NotFoundException("City not found!");
        cityRepository.deleteById(id);
        vectorIndexService.removeCity(id);
    }

}
