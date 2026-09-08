package br.unioeste.backend.repository.impl;

import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Cargo;
import br.unioeste.backend.repository.CargoRepository;

@Repository
public class CargoRepositoryImpl implements CargoRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Cargo> findById(Integer id) {
        Cargo cargo = em.find(Cargo.class, id);
        return Optional.ofNullable(cargo);
    }
}