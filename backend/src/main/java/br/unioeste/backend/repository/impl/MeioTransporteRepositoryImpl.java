package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.MeioTransporte;
import br.unioeste.backend.repository.MeioTransporteRepository;

@Repository
public class MeioTransporteRepositoryImpl implements MeioTransporteRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<MeioTransporte> findById(Integer id) {
        MeioTransporte meio = em.find(MeioTransporte.class, id);
        return Optional.ofNullable(meio);
    }

    @Override
    public List<MeioTransporte> findAll() {
        return em.createQuery("SELECT m FROM MeioTransporte m ORDER BY m.nome", MeioTransporte.class)
                 .getResultList();
    }
}