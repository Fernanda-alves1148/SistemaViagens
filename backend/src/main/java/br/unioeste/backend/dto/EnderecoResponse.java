package br.unioeste.backend.dto;

import br.unioeste.backend.entity.Endereco;

public record EnderecoResponse(
    Integer id,
    String descricao
) {
    public static EnderecoResponse de(Endereco endereco) {
        String descricao =
            endereco.getLogradouro().getNome()
            + ", " + endereco.getNumero()
            + " - " + endereco.getBairro().getNome()
            + " - " + endereco.getCidade().getNome()
            + "/" + endereco.getCidade().getSiglaUf();

        if (
            endereco.getComplemento() != null
            && !endereco.getComplemento().isBlank()
        ) {
            descricao += " - " + endereco.getComplemento();
        }

        return new EnderecoResponse(
            endereco.getId(),
            descricao
        );
    }
}