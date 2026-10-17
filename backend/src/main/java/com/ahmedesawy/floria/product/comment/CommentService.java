package com.ahmedesawy.floria.product.comment;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ahmedesawy.floria.common.exception.AccessDeniedException;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.product.ProductRepository;
import com.ahmedesawy.floria.product.comment.dto.CommentRequest;
import com.ahmedesawy.floria.product.comment.dto.CommentResponse;
import com.ahmedesawy.floria.user.customer.Customer;
import com.ahmedesawy.floria.user.customer.CustomerRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class CommentService {
    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;


    // ---- QUIRES -------------------------------------------------
    public List<CommentResponse> getProductComments(Long productId) {
        List<Comment> comments = commentRepository.findAllByProductIdOrderByIdDesc(productId);

        List<UUID> customerIds = comments.stream()
                .map(Comment::getCustomerId)
                .distinct()
                .toList();

        Map<UUID, Customer> customersById = customerRepository.findAllById(customerIds)
            .stream()
            .collect(Collectors.toMap(Customer::getId, Function.identity()));

        return comments.stream()
            .map(comment -> {
                Customer customer = customersById.get(comment.getCustomerId());
                if (customer == null) {
                    throw new NotFoundException("Customer not found!");
                }
                return CommentMapper.toResponse(comment, customer);
            })
            .toList();
    }


    // ---- CREATE COMMENT --------------------------------------------------------------------
    public void addComment(Long productId, CommentRequest request, UUID customerId) {
        productRepository.findByIdOrThrow(productId);
        
        Comment comment = Comment.builder()
                .customerId(customerId)
                .productId(productId)
                .content(request.getContent().trim())
                .rating(request.getRating())
                .build();

        commentRepository.save(comment);
    }

    // ---- UPDATE ---------------------------------------------------------------
    public void editComment(Long productId, Long commentId, CommentRequest request, UUID customerId) {
        Comment comment = commentRepository.findByIdOrThrow(commentId);

        if (!comment.getCustomerId().equals(customerId)) 
            throw new AccessDeniedException("You can only edit your own comments");
        
        if (!comment.getProductId().equals(productId)) 
            throw new IllegalArgumentException("Comment does not belong to this product");
        

        comment.setContent(request.getContent().trim());
        comment.setRating(request.getRating());

        commentRepository.save(comment);
    }

    // ---- DELETE ---------------------------------------------------------------
    public void deleteComment(Long productId, Long commentId ,UUID customerId) {
        Comment comment = commentRepository.findByIdOrThrow(commentId);

        if (!comment.getCustomerId().equals(customerId)) 
            throw new AccessDeniedException("You can only delete your own comments");
        
        if (!comment.getProductId().equals(productId)) 
            throw new IllegalArgumentException("Comment does not belong to this product");
        

        commentRepository.delete(comment);
    }



}   
