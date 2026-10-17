package com.ahmedesawy.floria.coupon;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface CouponRepository extends FindOrThrowRepository<Coupon, Integer> {

    // ---- FIND 
    Optional<Coupon> findByIdAndActiveTrue(Integer id);
    Optional<Coupon> findByCode(String code);

    // ---- EXIST
    boolean existsByCode(String code);

    // ---- FIND ALL
    List<Coupon> findByActiveTrue();

    List<Coupon> findByActiveFalse();


    @Modifying
    @Query("""
        UPDATE Coupon c
        SET c.usedCount = c.usedCount + 1,
            c.usageEnded = CASE 
                WHEN c.usedCount + 1 >= c.usageLimit THEN true 
                ELSE c.usageEnded 
            END
        WHERE c.code = :code
        AND c.active = true
        AND c.usageEnded = false
        AND c.dateEnded = false
        AND c.usedCount < c.usageLimit
        AND c.startAt < CURRENT_TIMESTAMP
        AND c.endAt > CURRENT_TIMESTAMP
    """)
    int incrementUsage(@Param("code") String code);


}