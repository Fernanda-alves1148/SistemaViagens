package br.unioeste.backend.repository.impl;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.HistoricoStatusViagem;
import br.unioeste.backend.repository.HistoricoStatusViagemRepository;

@Repository
public class HistoricoStatusViagemRepositoryImpl implements HistoricoStatusViagemRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<HistoricoStatusViagem> findByViagemId(Integer idViagem) {
        return em.createQuery(
                "SELECT h FROM HistoricoStatusViagem h " +
                "LEFT JOIN FETCH h.status " +
                "LEFT JOIN FETCH h.usuarioResponsavel u " +
                "LEFT JOIN FETCH u.empregado " +
                "WHERE h.viagem.id = :idViagem " +
                "ORDER BY h.dataAlteracao",
                HistoricoStatusViagem.class)
            .setParameter("idViagem", idViagem)
            .getResultList();
    }
}