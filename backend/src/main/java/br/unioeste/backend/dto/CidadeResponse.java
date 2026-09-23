package br.unioeste.backend.dto;

public record CidadeResponse(
    Integer id,
    String nome,
    String uf
) {
}