package br.unioeste.backend.repository;

import java.util.Optional;

import br.unioeste.backend.entity.HistoricoEmpregado;

public interface HistoricoEmpregadoRepository {
    Optional<HistoricoEmpregado> findAtivoByMatricula(String matricula);
    Optional<HistoricoEmpregado> findById(Integer id);
}