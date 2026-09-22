package br.unioeste.backend.dto;

import java.time.LocalDate;

public record EmpregadoResponse(
    String matricula,
    String nome,
    String cpf,
    Boolean ativo,
    Integer idEndereco,
    String cargo,
    String area,
    LocalDate dataInicio
) {
}