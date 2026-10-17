package com.ahmedesawy.floria.city;

import java.util.List;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface CityRepository extends FindOrThrowRepository<City, Integer> {
    Boolean existsByNameEnIgnoreCase(String nameEn);
    Boolean existsByNameArIgnoreCase(String namAr);

    boolean existsByNameEnIgnoreCaseAndIdNot(String nameEn, Integer id);
    boolean existsByNameArIgnoreCaseAndIdNot(String nameAr, Integer id);

    List<City> findByAvailableTrue();

    List<City> findByOrderByCreatedAtDesc();
}
