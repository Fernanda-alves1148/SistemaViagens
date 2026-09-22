package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Empregado;

public interface EmpregadoRepository {
    Optional<Empregado> findById(String matricula);
    List<Empregado> findAll();
    Empregado save(Empregado empregado);
}