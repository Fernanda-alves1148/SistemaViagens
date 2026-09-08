package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Viagem;
import br.unioeste.backend.repository.ViagemRepository;

@Repository
public class ViagemRepositoryImpl implements ViagemRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Viagem> findById(Integer id) {
        Viagem viagem = em.find(Viagem.class, id);
        return Optional.ofNullable(viagem);
    }

    @Override
    public Optional<Viagem> findByIdWithRelations(Integer id) {
        try {
            Viagem viagem = em.createQuery(
                    "SELECT DISTINCT v FROM Viagem v " +
                    "LEFT JOIN FETCH v.origem " +
                    "LEFT JOIN FETCH v.destino " +
                    "LEFT JOIN FETCH v.motivo " +
                    "LEFT JOIN FETCH v.meioTransporte " +
                    "LEFT JOIN FETCH v.status " +
                    "LEFT JOIN FETCH v.solicitante " +
                    "LEFT JOIN FETCH v.historicoEmpregado he " +
                    "LEFT JOIN FETCH he.cargo " +
                    "LEFT JOIN FETCH he.area " +
                    "WHERE v.id = :id",
                    Viagem.class)
                .setParameter("id", id)
                .getSingleResult();
            return Optional.of(viagem);
        } catch (jakarta.persistence.NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Viagem> findAll() {
        return em.createQuery(
                "SELECT DISTINCT v FROM Viagem v " +
                "LEFT JOIN FETCH v.origem " +
                "LEFT JOIN FETCH v.destino " +
                "LEFT JOIN FETCH v.motivo " +
                "LEFT JOIN FETCH v.meioTransporte " +
                "LEFT JOIN FETCH v.status " +
                "LEFT JOIN FETCH v.solicitante " +
                "LEFT JOIN FETCH v.historicoEmpregado he " +
                "LEFT JOIN FETCH he.cargo " +
                "LEFT JOIN FETCH he.area " +
                "ORDER BY v.id",
                Viagem.class)
            .getResultList();
    }

    @Override
    public Viagem save(Viagem viagem) {
        if (viagem.getId() == null) {
            em.persist(viagem);
            return viagem;
        } else {
            return em.merge(viagem);
        }
    }

    @Override
    public void alterarStatusViagem(Integer idViagem, Integer idNovoStatus, Integer idUsuarioResponsavel, String observacao) {
        // Chama a função PostgreSQL diretamente — zero magia, SQL nativo explícito
        em.createNativeQuery("SELECT alterar_status_viagem(:idViagem, :idNovoStatus, :idUsuarioResponsavel, :observacao)")
            .setParameter("idViagem", idViagem)
            .setParameter("idNovoStatus", idNovoStatus)
            .setParameter("idUsuarioResponsavel", idUsuarioResponsavel)
            .setParameter("observacao", observacao)
            .getSingleResult();
    }
}