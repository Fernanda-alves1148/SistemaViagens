package br.unioeste.backend.dto;

import java.time.LocalDate;
import java.util.List;

import br.unioeste.backend.entity.Viagem;

public record ViagemResponse(
    Integer id,
    LocalDate dataInicio,
    LocalDate dataFim,
    String origem,
    String ufOrigem,
    String destino,
    String ufDestino,
    String motivo,
    List<String> meiosTransporte,
    String status,
    String solicitante,
    String cargoNoMomento,
    String areaNoMomento,
    String justificativa
) {

    public static ViagemResponse de(Viagem viagem) {
        String cargo = viagem.getHistoricoEmpregado() != null && viagem.getHistoricoEmpregado().getCargo() != null
            ? viagem.getHistoricoEmpregado().getCargo().getNome()
            : null;

        String area = viagem.getHistoricoEmpregado() != null && viagem.getHistoricoEmpregado().getArea() != null
            ? viagem.getHistoricoEmpregado().getArea().getNome()
            : null;

        return new ViagemResponse(
            viagem.getId(),
            viagem.getDataInicio(),
            viagem.getDataFim(),
            viagem.getOrigem().getNome(),
            viagem.getOrigem().getSiglaUf(),
            viagem.getDestino().getNome(),
            viagem.getDestino().getSiglaUf(),
            viagem.getMotivo().getNome(),
            viagem.getMeiosTransporte().stream()
                .map(meio -> meio.getNome())
                .sorted()
                .toList(),
            viagem.getStatus().getNome(),
            viagem.getSolicitante().getNome(),
            cargo,
            area,
            viagem.getJustificativa()
        );
    }
}