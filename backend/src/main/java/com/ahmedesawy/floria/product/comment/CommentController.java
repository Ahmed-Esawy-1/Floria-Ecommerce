package com.ahmedesawy.floria.product.comment;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.auth.CustomerPrincipal;
import com.ahmedesawy.floria.product.comment.dto.CommentRequest;
import com.ahmedesawy.floria.product.comment.dto.CommentResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product/{productId}")
@Validated
public class CommentController {
    private final CommentService commentService;

    // ---- QUIRES --------------------------------------------
    @GetMapping("/comments")
    public List<CommentResponse> getComments(@PathVariable Long productId) {
        return commentService.getProductComments(productId);
    }

    // ---- CREATE COMMENT --------------------------------------------
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/comment/add")
    public ResponseEntity<String> addComment(
            @PathVariable Long productId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal CustomerPrincipal principal) {
        UUID customerId = principal.getId();
        commentService.addComment(productId, request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Comment added");
    }

    // ---- UPDATE COMMENT --------------------------------------------
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/comment/edit/{commentId}")
    public ResponseEntity<String> editComment(
            @PathVariable Long productId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal CustomerPrincipal principal) {
        UUID customerId = principal.getId();
        commentService.editComment(productId, commentId, request, customerId);
        return ResponseEntity.ok("Comment updated");
    }

    // ---- DELETE COMMENT --------------------------------------------
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/comment/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long productId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomerPrincipal principal) {
        UUID customerId = principal.getId();
        commentService.deleteComment(productId, commentId, customerId);
        return ResponseEntity.noContent().build();
    }

}
