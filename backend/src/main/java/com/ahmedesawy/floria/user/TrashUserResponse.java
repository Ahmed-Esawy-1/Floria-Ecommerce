package com.ahmedesawy.floria.user;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrashUserResponse {
    private UUID id;
    private String userName;
    private String imageUrl;
    private LocalDateTime deletedAt;
}
