package com.ahmedesawy.floria.user.employee.dto.request;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEmployeeRequest {

   private String userName;

   @Email(message = "Invalid email format")
   private String email;

   @Size(min = 8)
   @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password must contain letters and digits")
   private String password;

   private MultipartFile image;

   private UUID roleId;
}
