package br.unioeste.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroNomeRequest(

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 80, message = "O nome deve possuir no máximo 80 caracteres")
    String nome

) {
}