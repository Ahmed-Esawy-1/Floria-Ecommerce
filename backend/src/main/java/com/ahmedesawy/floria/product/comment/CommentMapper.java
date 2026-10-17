package com.ahmedesawy.floria.product.comment;

import com.ahmedesawy.floria.common.util.ImageUrlResolver;
import com.ahmedesawy.floria.product.comment.dto.CommentResponse;
import com.ahmedesawy.floria.user.customer.Customer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CommentMapper {

    // ---- MAIN
    public static CommentResponse toResponse(Comment comment, Customer customer) {
        return CommentResponse.builder()
                .id(comment.getId())
                .customerId(comment.getCustomerId())
                .customerName(customer.getUserName())
                .customerImage(
                        ImageUrlResolver.resolve("users",
                                customer.getImageUrl()))
                .content(comment.getContent())
                .rating(comment.getRating())
                .createdAt(
                        comment.getCreatedAt())
                .build();
    }

}
