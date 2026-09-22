package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Area;

public interface AreaRepository {
    Optional<Area> findById(Integer id);
    List<Area> findAll();
    Area save(Area area);
}