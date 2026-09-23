package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.TipoDespesa;

public interface TipoDespesaRepository {
    Optional<TipoDespesa> findById(Integer id);
    List<TipoDespesa> findAll();
}