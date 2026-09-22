package br.unioeste.backend.repository;

import java.util.List;
import java.util.Optional;

import br.unioeste.backend.entity.Viagem;

public interface ViagemRepository {
    Optional<Viagem> findById(Integer id);
    Optional<Viagem> findByIdWithRelations(Integer id);
    List<Viagem> findAll();
    Viagem save(Viagem viagem);

    void atualizarHistoricoEmpregado(
        Integer idViagem,
        Integer idHistoricoEmpregado
    );

    void alterarStatusViagem(
        Integer idViagem,
        Integer idNovoStatus,
        Integer idUsuarioResponsavel,
        String observacao
    );
}