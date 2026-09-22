package br.unioeste.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CriarEmpregadoRequest(

    @NotBlank(message = "A matrícula é obrigatória")
    @Pattern(
        regexp = "\\d{4}-\\d",
        message = "A matrícula deve possuir o formato XXXX-X"
    )
    String matricula,

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 100)
    String nome,

    @NotBlank(message = "O CPF é obrigatório")
    @Size(max = 14)
    String cpf,

    @NotNull(message = "O endereço é obrigatório")
    Integer idEndereco,

    @NotNull(message = "O cargo é obrigatório")
    Integer idCargo,

    @NotNull(message = "A área é obrigatória")
    Integer idArea,

    @NotNull(message = "A data de início é obrigatória")
    LocalDate dataInicio

) {
}