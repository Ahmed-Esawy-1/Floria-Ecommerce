package com.ahmedesawy.floria.city;

import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.city.dto.CityRequest;
import com.ahmedesawy.floria.city.dto.CityResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    // ---- QUIRES -------------------------------------------------
    @PreAuthorize("hasAuthority('read:city')")
    @GetMapping("/cities")
    public List<City> getAllCities() {
        return cityService.getAllCities();
    }

    @GetMapping("/cities/available")
    public List<CityResponse> getAvailableCities() {
        return cityService.getAvailableCities();
    }

    @PreAuthorize("hasAuthority('read:city')")
    @GetMapping("/city/{id}")
    public City getCityById(@PathVariable Integer id) {
        return cityService.getCityById(id);
    }

    // ---- CREATE -------------------------------------------------
    @PreAuthorize("hasAuthority('create:city')")
    @PostMapping("/city/add")
    public ResponseEntity<String> addCity(@RequestBody @Valid CityRequest city) {
        return new ResponseEntity<>(cityService.addCity(city), HttpStatus.CREATED);
    }

    // ---- UPDATE -------------------------------------------------
    @PreAuthorize("hasAuthority('update:city')")
    @PutMapping("/city/update/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Integer id, @RequestBody @Valid CityRequest city) {
        return ResponseEntity.ok(cityService.updateCity(id, city));
    }

    // ---- DELETE -------------------------------------------------
    @DeleteMapping("/city/delete/{id}/permanent")
    public ResponseEntity<Void> deleteCityPermanently(@PathVariable Integer id) {
        cityService.deletePermanently(id);
        return ResponseEntity.noContent().build();
    }

}
