package br.unioeste.backend.repository;

import java.util.Optional;

import br.unioeste.backend.entity.Cargo;

public interface CargoRepository {
    Optional<Cargo> findById(Integer id);
}