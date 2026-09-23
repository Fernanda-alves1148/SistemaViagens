package br.unioeste.backend.dto;

import jakarta.validation.constraints.NotNull;

public record AcaoStatusViagemRequest(

    @NotNull(message = "O usuário responsável é obrigatório")
    Integer idUsuarioResponsavel,

    String observacao

) {
}