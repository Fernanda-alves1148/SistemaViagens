package br.unioeste.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.backend.entity.MeioTransporte;

public interface MeioTransporteRepository
    extends JpaRepository<MeioTransporte, Integer> {
}