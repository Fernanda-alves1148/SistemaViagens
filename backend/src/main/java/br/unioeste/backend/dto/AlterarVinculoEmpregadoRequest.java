package br.unioeste.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record AlterarVinculoEmpregadoRequest(

    @NotNull(message = "O cargo é obrigatório")
    Integer idCargo,

    @NotNull(message = "A área é obrigatória")
    Integer idArea,

    @NotNull(message = "A data inicial é obrigatória")
    LocalDate dataInicio

) {
}