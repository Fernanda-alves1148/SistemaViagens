package br.unioeste.backend.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record AtualizarViagemRequest(

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

    @NotEmpty(message = "Informe pelo menos um meio de transporte")
    List<@NotNull(message = "O meio de transporte não pode ser nulo") Integer> idsMeiosTransporte,

    String justificativa

) {
}