package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Cidade;

public interface CidadeRepository {
    Optional<Cidade> findById(Integer id);
    List<Cidade> findAll();
}