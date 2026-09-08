package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.StatusViagem;

public interface StatusViagemRepository {
    Optional<StatusViagem> findById(Integer id);
    Optional<StatusViagem> findByNomeIgnoreCase(String nome);
    List<StatusViagem> findAll();
}