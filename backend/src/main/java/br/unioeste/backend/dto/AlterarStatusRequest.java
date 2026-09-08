package br.unioeste.backend.dto;

import jakarta.validation.constraints.NotNull;

public record AlterarStatusRequest(

    @NotNull(message = "O novo status é obrigatório")
    Integer idNovoStatus,

    @NotNull(message = "O usuário responsável é obrigatório")
    Integer idUsuarioResponsavel,

    String observacao

) {
}