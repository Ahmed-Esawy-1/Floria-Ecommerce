package com.ahmedesawy.floria.product.comment;

import java.util.List;
import java.util.UUID;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface CommentRepository extends FindOrThrowRepository<Comment, Long> {
    List<Comment> findAllByProductIdOrderByIdDesc(Long productId);
    boolean existsByCustomerIdAndProductId(UUID customerId, Long productId);
} 
