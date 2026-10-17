package com.ahmedesawy.floria.product.comment.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    @NotBlank(message = "Your comment can't be empty.")
    @Size(max = 1000, message = "Your comment is too long.")
    private String content;
    @Min(1)
    @Max(5)
    private Integer rating;

    private LocalDateTime createdAt;
}
