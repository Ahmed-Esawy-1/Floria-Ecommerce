package com.ahmedesawy.floria.common.init;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.section.Section;
import com.ahmedesawy.floria.section.SectionRepository;
import com.ahmedesawy.floria.section.SectionType;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SectionInitService {

    private final SectionRepository sectionRepository;

    @Transactional
    @PostConstruct
    public void initDefaultSections() {
        ensureSectionExists(SectionType.RELEASE, "Release", "منتجات جديدة", "/new-arrivals");
        ensureSectionExists(SectionType.BEST_SELLER, "Best Seller", "الأكثر مبيعاً", "/best-sellers");
    }

    private void ensureSectionExists(SectionType type, String nameEn, String nameAr, String urlVisit) {
        sectionRepository.findByType(type).orElseGet(() -> {
            Section s = new Section();
            s.setNameEn(nameEn);
            s.setNameAr(nameAr);
            s.setUrlVisit(urlVisit);
            s.setType(type);
            return sectionRepository.save(s);
        });
    }
}