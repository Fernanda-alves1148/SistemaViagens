package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Motivo;
import br.unioeste.backend.repository.MotivoRepository;

@Repository
public class MotivoRepositoryImpl implements MotivoRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Motivo> findById(Integer id) {
        Motivo motivo = em.find(Motivo.class, id);
        return Optional.ofNullable(motivo);
    }

    @Override
    public List<Motivo> findAll() {
        return em.createQuery("SELECT m FROM Motivo m ORDER BY m.nome", Motivo.class)
                 .getResultList();
    }
}