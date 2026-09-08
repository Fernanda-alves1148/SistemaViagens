package br.unioeste.backend.repository;

import java.util.Optional;

import br.unioeste.backend.entity.Area;

public interface AreaRepository {
    Optional<Area> findById(Integer id);
}