package br.unioeste.backend.dto;

import java.time.LocalDateTime;

import br.unioeste.backend.entity.HistoricoStatusViagem;
import br.unioeste.backend.entity.Usuario;

public record HistoricoStatusResponse(
    Integer id,
    String status,
    LocalDateTime dataAlteracao,
    Integer idUsuarioResponsavel,
    String loginResponsavel,
    String nomeResponsavel,
    String observacao
) {

    public static HistoricoStatusResponse de(
        HistoricoStatusViagem historico
    ) {
        Usuario usuario = historico.getUsuarioResponsavel();

        return new HistoricoStatusResponse(
            historico.getId(),
            historico.getStatus().getNome(),
            historico.getDataAlteracao(),
            usuario.getId(),
            usuario.getLogin(),
            usuario.getEmpregado().getNome(),
            historico.getObservacao()
        );
    }
}