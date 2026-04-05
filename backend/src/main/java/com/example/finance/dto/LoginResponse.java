package com.example.finance.dto;

import com.example.finance.model.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
}
