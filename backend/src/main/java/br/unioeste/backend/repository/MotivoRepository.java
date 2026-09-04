package br.unioeste.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.backend.entity.Motivo;

public interface MotivoRepository
    extends JpaRepository<Motivo, Integer> {
}