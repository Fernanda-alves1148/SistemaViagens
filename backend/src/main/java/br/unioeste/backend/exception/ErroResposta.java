package br.unioeste.backend.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErroResposta(
    LocalDateTime instante,
    int status,
    String erro,
    String mensagem,
    String caminho,
    Map<String, String> campos
) {
}