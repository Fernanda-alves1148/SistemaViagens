package br.unioeste.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.backend.entity.Responsavel;

public interface ResponsavelRepository
    extends JpaRepository<Responsavel, Integer> {
}