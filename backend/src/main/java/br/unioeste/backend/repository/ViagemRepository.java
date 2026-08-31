package br.unioeste.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.backend.entity.Viagem;

public interface ViagemRepository
    extends JpaRepository<Viagem, Integer> {
}