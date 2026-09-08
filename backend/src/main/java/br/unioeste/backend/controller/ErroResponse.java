package br.unioeste.backend.controller;

import java.time.LocalDateTime;

public record ErroResponse(
    LocalDateTime dataHora,
    int status,
    String erro,
    String mensagem
) {
}