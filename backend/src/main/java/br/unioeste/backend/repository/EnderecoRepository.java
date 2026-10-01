package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Endereco;

public interface EnderecoRepository {

    Optional<Endereco> findById(Integer id);

    List<Endereco> findAll();
}