package br.unioeste.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.unioeste.backend.entity.Cidade;

public interface CidadeRepository
    extends JpaRepository<Cidade, Integer> {
}