package br.unioeste.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.backend.entity.StatusViagem;

public interface StatusViagemRepository
    extends JpaRepository<StatusViagem, Integer> {

    Optional<StatusViagem> findByNomeIgnoreCase(String nome);
}