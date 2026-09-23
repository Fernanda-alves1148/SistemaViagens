package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Despesa;
import br.unioeste.backend.repository.DespesaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class DespesaRepositoryImpl implements DespesaRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Despesa> findById(Integer id) {
        return Optional.ofNullable(
            em.find(Despesa.class, id)
        );
    }

    @Override
    public List<Despesa> findByViagemId(Integer idViagem) {
        return em.createQuery(
                "SELECT d FROM Despesa d " +
                "JOIN FETCH d.tipo " +
                "WHERE d.viagem.id = :idViagem " +
                "ORDER BY d.dataDespesa, d.id",
                Despesa.class
            )
            .setParameter("idViagem", idViagem)
            .getResultList();
    }

    @Override
    public List<Despesa> findAll() {
        return em.createQuery(
                "SELECT d FROM Despesa d " +
                "JOIN FETCH d.tipo " +
                "JOIN FETCH d.viagem",
                Despesa.class
            )
            .getResultList();
    }

    @Override
    public Despesa save(Despesa despesa) {
        em.persist(despesa);
        return despesa;
    }

    @Override
    public void delete(Despesa despesa) {
        em.remove(
            em.contains(despesa)
                ? despesa
                : em.merge(despesa)
        );
    }
}