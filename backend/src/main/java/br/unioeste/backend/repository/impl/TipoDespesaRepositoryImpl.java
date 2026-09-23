package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.TipoDespesa;
import br.unioeste.backend.repository.TipoDespesaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class TipoDespesaRepositoryImpl implements TipoDespesaRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<TipoDespesa> findById(Integer id) {
        return Optional.ofNullable(
            em.find(TipoDespesa.class, id)
        );
    }

    @Override
    public List<TipoDespesa> findAll() {
        return em.createQuery(
                "SELECT t FROM TipoDespesa t ORDER BY t.nome",
                TipoDespesa.class
            )
            .getResultList();
    }
}