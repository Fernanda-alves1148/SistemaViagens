package br.unioeste.backend.dto;

import java.time.LocalDate;
import java.util.List;

import br.unioeste.backend.entity.Viagem;

public record ViagemResponse(
    Integer id,
    LocalDate dataInicio,
    LocalDate dataFim,
    String origem,
    String destino,
    String motivo,
    String status,
    String responsavel,
    List<String> meiosTransporte
) {

    public static ViagemResponse de(Viagem viagem) {
        List<String> meios = viagem.getMeiosTransporte()
            .stream()
            .map(meio -> meio.getNome())
            .sorted()
            .toList();

        return new ViagemResponse(
            viagem.getId(),
            viagem.getDataInicio(),
            viagem.getDataFim(),
            viagem.getOrigem().getNome(),
            viagem.getDestino().getNome(),
            viagem.getMotivo().getNome(),
            viagem.getStatus().getNome(),
            viagem.getResponsavel().getNome(),
            meios
        );
    }
}