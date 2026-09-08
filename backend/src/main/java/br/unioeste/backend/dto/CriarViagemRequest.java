package br.unioeste.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record CriarViagemRequest(

    @NotNull(message = "A data inicial é obrigatória")
    LocalDate dataInicio,

    @NotNull(message = "A data final é obrigatória")
    LocalDate dataFim,

    @NotNull(message = "A origem é obrigatória")
    Integer idOrigem,

    @NotNull(message = "O destino é obrigatório")
    Integer idDestino,

    @NotNull(message = "O motivo é obrigatório")
    Integer idMotivo,

    @NotNull(message = "O solicitante é obrigatório")
    String matriculaSolicitante,

    @NotNull(message = "O meio de transporte é obrigatório")
    Integer idMeioTransporte

) {
}