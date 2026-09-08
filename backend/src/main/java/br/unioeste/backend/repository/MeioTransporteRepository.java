package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.MeioTransporte;

public interface MeioTransporteRepository {
    Optional<MeioTransporte> findById(Integer id);
    List<MeioTransporte> findAll();
}