package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Despesa;

public interface DespesaRepository {
    Optional<Despesa> findById(Integer id);
    List<Despesa> findByViagemId(Integer idViagem);
    List<Despesa> findAll();
    Despesa save(Despesa despesa);
    void delete(Despesa despesa);
}