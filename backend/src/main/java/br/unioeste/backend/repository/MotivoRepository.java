package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Motivo;

public interface MotivoRepository {
    Optional<Motivo> findById(Integer id);
    List<Motivo> findAll();
}