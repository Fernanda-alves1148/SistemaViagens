package br.unioeste.backend.service;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import br.unioeste.backend.dto.AcaoStatusViagemRequest;
import br.unioeste.backend.dto.AlterarStatusRequest;
import br.unioeste.backend.dto.CriarViagemRequest;
import br.unioeste.backend.dto.HistoricoStatusResponse;
import br.unioeste.backend.dto.ViagemResponse;
import br.unioeste.backend.entity.Cidade;
import br.unioeste.backend.entity.Empregado;
import br.unioeste.backend.entity.HistoricoEmpregado;
import br.unioeste.backend.entity.MeioTransporte;
import br.unioeste.backend.entity.Motivo;
import br.unioeste.backend.entity.StatusViagem;
import br.unioeste.backend.entity.Usuario;
import br.unioeste.backend.entity.Viagem;
import br.unioeste.backend.exception.RecursoNaoEncontradoException;
import br.unioeste.backend.exception.RegraNegocioException;
import br.unioeste.backend.repository.CidadeRepository;
import br.unioeste.backend.repository.EmpregadoRepository;
import br.unioeste.backend.repository.HistoricoEmpregadoRepository;
import br.unioeste.backend.repository.HistoricoStatusViagemRepository;
import br.unioeste.backend.repository.MeioTransporteRepository;
import br.unioeste.backend.repository.MotivoRepository;
import br.unioeste.backend.repository.StatusViagemRepository;
import br.unioeste.backend.repository.UsuarioRepository;
import br.unioeste.backend.repository.ViagemRepository;
import org.springframework.transaction.annotation.Transactional;
import br.unioeste.backend.dto.AtualizarViagemRequest;

@Service
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final CidadeRepository cidadeRepository;
    private final MotivoRepository motivoRepository;
    private final StatusViagemRepository statusRepository;
    private final EmpregadoRepository empregadoRepository;
    private final MeioTransporteRepository meioRepository;
    private final HistoricoEmpregadoRepository historicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistoricoStatusViagemRepository historicoStatusRepository;

    private final PlatformTransactionManager transactionManager;

    public ViagemService(
        ViagemRepository viagemRepository,
        CidadeRepository cidadeRepository,
        MotivoRepository motivoRepository,
        StatusViagemRepository statusRepository,
        EmpregadoRepository empregadoRepository,
        MeioTransporteRepository meioRepository,
        HistoricoEmpregadoRepository historicoRepository,
        UsuarioRepository usuarioRepository,
        HistoricoStatusViagemRepository historicoStatusRepository,
        PlatformTransactionManager transactionManager
    ) {
        this.viagemRepository = viagemRepository;
        this.cidadeRepository = cidadeRepository;
        this.motivoRepository = motivoRepository;
        this.statusRepository = statusRepository;
        this.empregadoRepository = empregadoRepository;
        this.meioRepository = meioRepository;
        this.historicoRepository = historicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.historicoStatusRepository = historicoStatusRepository;
        this.transactionManager = transactionManager;
    }

    /**
     * Cadastra uma nova viagem.
     *
     * Toda nova viagem começa com o status "Rascunho".
     *
     * O histórico funcional do empregado é armazenado junto
     * com a viagem para preservar o cargo e a área que ele possuía
     * no momento da solicitação.
     */
    public ViagemResponse cadastrar(CriarViagemRequest request) {

        validar(request);

        TransactionStatus tx = transactionManager.getTransaction(
            new DefaultTransactionDefinition()
        );

        System.out.println(
            "[TRANSAÇÃO] >>> INICIADA para cadastro de viagem"
        );

        try {

            // ---------------------------------------------------------
            // 1. Busca cidade de origem
            // ---------------------------------------------------------

            Cidade origem = cidadeRepository
                .findById(request.idOrigem())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Cidade de origem não encontrada (ID: "
                    + request.idOrigem() + ")"
                ));

            System.out.println(
                "[REPOSITORY] Cidade origem: "
                + origem.getNome()
            );


            // ---------------------------------------------------------
            // 2. Busca cidade de destino
            // ---------------------------------------------------------

            Cidade destino = cidadeRepository
                .findById(request.idDestino())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Cidade de destino não encontrada (ID: "
                    + request.idDestino() + ")"
                ));

            System.out.println(
                "[REPOSITORY] Cidade destino: "
                + destino.getNome()
            );


            // ---------------------------------------------------------
            // 3. Busca motivo
            // ---------------------------------------------------------

            Motivo motivo = motivoRepository
                .findById(request.idMotivo())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Motivo não encontrado (ID: "
                    + request.idMotivo() + ")"
                ));

            System.out.println(
                "[REPOSITORY] Motivo: "
                + motivo.getNome()
            );


            // ---------------------------------------------------------
            // 4. Busca empregado solicitante
            // ---------------------------------------------------------

            Empregado solicitante = empregadoRepository
                .findById(request.matriculaSolicitante())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Empregado não encontrado (Matrícula: "
                    + request.matriculaSolicitante() + ")"
                ));

            System.out.println(
                "[REPOSITORY] Empregado: "
                + solicitante.getNome()
            );


            // ---------------------------------------------------------
            // 5. Busca histórico funcional ativo
            // ---------------------------------------------------------

            HistoricoEmpregado historico = historicoRepository
                .findAtivoByMatricula(request.matriculaSolicitante())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Histórico ativo não encontrado para: "
                    + request.matriculaSolicitante()
                ));

            System.out.println(
                "[REPOSITORY] Histórico ativo (ID: "
                + historico.getId()
                + ", Cargo: "
                + historico.getCargo().getNome()
                + ", Área: "
                + historico.getArea().getNome()
                + ")"
            );


            // ---------------------------------------------------------
            // 6. Busca status inicial
            // ---------------------------------------------------------

            StatusViagem status = statusRepository
                .findByNomeIgnoreCase("Rascunho")
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Status 'Rascunho' não encontrado"
                ));

            System.out.println(
                "[REPOSITORY] Status inicial: "
                + status.getNome()
            );


            // ---------------------------------------------------------
            // 7. Busca os meios de transporte
            // ---------------------------------------------------------

            Set<MeioTransporte> meios = buscarMeiosTransporte(
                request.idsMeiosTransporte()
            );

            System.out.println(
                "[REPOSITORY] Meios encontrados: " + meios.size()
            );


            // ---------------------------------------------------------
            // 8. Cria a viagem
            // ---------------------------------------------------------

            Viagem viagem = new Viagem(
                request.dataInicio(),
                request.dataFim(),
                origem,
                destino,
                motivo,
                meios,
                status,
                solicitante,
                historico,
                null
            );

            System.out.println(
                "[SERVICE] Viagem montada"
            );


            // ---------------------------------------------------------
            // 9. Persiste a viagem
            // ---------------------------------------------------------

            Viagem viagemSalva = viagemRepository.save(viagem);

            System.out.println(
                "[REPOSITORY] Viagem persistida (ID: "
                + viagemSalva.getId()
                + ")"
            );


            // ---------------------------------------------------------
            // 10. O PostgreSQL registra o histórico inicial
            // ---------------------------------------------------------

            System.out.println(
                "[TRIGGER] fn_registrar_status_inicial "
                + "executado pelo PostgreSQL"
            );


            // ---------------------------------------------------------
            // 11. Confirma transação
            // ---------------------------------------------------------

            transactionManager.commit(tx);

            System.out.println(
                "[TRANSAÇÃO] >>> COMMIT realizado com sucesso!"
            );


            return ViagemResponse.de(viagemSalva);

        } catch (Exception e) {

            if (!tx.isCompleted()) {
                transactionManager.rollback(tx);
            }

            System.out.println(
                "[TRANSAÇÃO] >>> ROLLBACK executado!"
            );

            System.out.println(
                "[TRANSAÇÃO] >>> Motivo: "
                + e.getMessage()
            );

            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<ViagemResponse> listar() {
        return viagemRepository.findAll()
            .stream()
            .map(ViagemResponse::de)
            .toList();
    }

    @Transactional(readOnly = true)
    public ViagemResponse buscarPorId(Integer id) {
        Viagem viagem = viagemRepository
            .findByIdWithRelations(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Viagem não encontrada (ID: " + id + ")"
            ));

        return ViagemResponse.de(viagem);
    }

    @Transactional
    public ViagemResponse atualizar(
        Integer id,
        AtualizarViagemRequest request
    ) {
        Viagem viagem = viagemRepository
            .findByIdWithRelations(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Viagem não encontrada (ID: " + id + ")"
            ));

        String status = viagem.getStatus().getNome();

        if (!status.equalsIgnoreCase("Rascunho")
            && !status.equalsIgnoreCase("Ajustes")) {

            throw new RegraNegocioException(
                "Somente viagens em Rascunho ou Ajustes podem ser editadas."
            );
        }

        if (request.dataFim().isBefore(request.dataInicio())) {
            throw new RegraNegocioException(
                "A data de fim não pode ser anterior à data de início."
            );
        }

        if (request.idOrigem().equals(request.idDestino())) {
            throw new RegraNegocioException(
                "A cidade de origem deve ser diferente da cidade de destino."
            );
        }

        Cidade origem = cidadeRepository
            .findById(request.idOrigem())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Cidade de origem não encontrada."
            ));

        Cidade destino = cidadeRepository
            .findById(request.idDestino())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Cidade de destino não encontrada."
            ));

        Motivo motivo = motivoRepository
            .findById(request.idMotivo())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Motivo não encontrado."
            ));

        Set<MeioTransporte> meios = buscarMeiosTransporte(
            request.idsMeiosTransporte()
        );

        viagem.atualizar(
            request.dataInicio(),
            request.dataFim(),
            origem,
            destino,
            motivo,
            meios,
            request.justificativa()
        );

        Viagem atualizada = viagemRepository.save(viagem);

        return ViagemResponse.de(atualizada);
    }
public void solicitar(
    Integer idViagem,
    AcaoStatusViagemRequest request
) {
    alterarStatus(
        idViagem,
        new AlterarStatusRequest(
            2,
            request.idUsuarioResponsavel(),
            request.observacao()
        )
    );
}

public void cancelar(
    Integer idViagem,
    AcaoStatusViagemRequest request
) {
    alterarStatus(
        idViagem,
        new AlterarStatusRequest(
            6,
            request.idUsuarioResponsavel(),
            request.observacao()
        )
    );
}

public void solicitarAjustes(
    Integer idViagem,
    AcaoStatusViagemRequest request
) {
    if (
        request.observacao() == null
        || request.observacao().isBlank()
    ) {
        throw new RegraNegocioException(
            "A observação é obrigatória ao solicitar ajustes."
        );
    }

    alterarStatus(
        idViagem,
        new AlterarStatusRequest(
            3,
            request.idUsuarioResponsavel(),
            request.observacao()
        )
    );
}

public void aprovar(
    Integer idViagem,
    AcaoStatusViagemRequest request
) {
    alterarStatus(
        idViagem,
        new AlterarStatusRequest(
            4,
            request.idUsuarioResponsavel(),
            request.observacao()
        )
    );
}

public void rejeitar(
    Integer idViagem,
    AcaoStatusViagemRequest request
) {
    alterarStatus(
        idViagem,
        new AlterarStatusRequest(
            5,
            request.idUsuarioResponsavel(),
            request.observacao()
        )
    );
}
    /**
     * Altera o status de uma viagem.
     *
     * A alteração é feita através da função PostgreSQL
     * alterar_status_viagem(), que também registra o histórico.
     */
    public void alterarStatus(
        Integer idViagem,
        AlterarStatusRequest request
    ) {

        TransactionStatus tx = transactionManager.getTransaction(
            new DefaultTransactionDefinition()
        );

        System.out.println(
            "[TRANSAÇÃO] >>> INICIADA para alteração de status"
        );

        try {

            // ---------------------------------------------------------
            // 1. Busca viagem
            // ---------------------------------------------------------

            Viagem viagem = viagemRepository
                .findById(idViagem)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Viagem não encontrada (ID: "
                    + idViagem + ")"
                ));

            System.out.println(
                "[REPOSITORY] Viagem encontrada. "
                + "Status atual: "
                + viagem.getStatus().getNome()
            );


            // ---------------------------------------------------------
            // 2. Busca usuário responsável
            // ---------------------------------------------------------

            Usuario usuario = usuarioRepository
                .findById(request.idUsuarioResponsavel())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Usuário não encontrado (ID: "
                    + request.idUsuarioResponsavel() + ")"
                ));

            System.out.println(
                "[REPOSITORY] Usuário responsável: "
                + usuario.getLogin()
            );

            // Ao solicitar a viagem, registra o cargo e a área
            // vigentes exatamente nesse momento.
            if (Integer.valueOf(2).equals(request.idNovoStatus())) {

                String matricula = viagem
                    .getSolicitante()
                    .getMatricula();

                HistoricoEmpregado historicoAtual = historicoRepository
                    .findAtivoByMatricula(matricula)
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Histórico funcional ativo não encontrado para: "
                        + matricula
                    ));

                viagemRepository.atualizarHistoricoEmpregado(
                    idViagem,
                    historicoAtual.getId()
                );

                System.out.println(
                    "[REGRA] Histórico funcional atualizado na solicitação. ID: "
                    + historicoAtual.getId()
                );
            }

            // ---------------------------------------------------------
            // 3. Executa função PostgreSQL
            // ---------------------------------------------------------

            viagemRepository.alterarStatusViagem(
                idViagem,
                request.idNovoStatus(),
                request.idUsuarioResponsavel(),
                request.observacao()
            );

            System.out.println(
                "[SQL NATIVO] Função executada com sucesso"
            );


            // ---------------------------------------------------------
            // 4. Commit
            // ---------------------------------------------------------

            transactionManager.commit(tx);

            System.out.println(
                "[TRANSAÇÃO] >>> COMMIT realizado. "
                + "Status alterado."
            );

        } catch (Exception e) {

            if (!tx.isCompleted()) {
                transactionManager.rollback(tx);
            }

            System.out.println(
                "[TRANSAÇÃO] >>> ROLLBACK executado!"
            );

            System.out.println(
                "[TRANSAÇÃO] >>> Motivo: "
                + e.getMessage()
            );

            throw e;
        }
    }


    /**
     * Valida os dados básicos utilizados no cadastro da viagem.
     */
    private Set<MeioTransporte> buscarMeiosTransporte(List<Integer> idsMeios) {
        Set<MeioTransporte> meios = new LinkedHashSet<>();

        for (Integer idMeio : idsMeios) {
            MeioTransporte meio = meioRepository
                .findById(idMeio)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                    "Meio de transporte não encontrado (ID: " + idMeio + ")"
                ));

            meios.add(meio);
        }

        return meios;
    }

    private void validar(CriarViagemRequest request) {

        if (request == null) {
            throw new RegraNegocioException(
                "Os dados da viagem são obrigatórios."
            );
        }


        // -------------------------------------------------------------
        // Datas
        // -------------------------------------------------------------

        if (request.dataInicio() == null) {
            throw new RegraNegocioException(
                "A data de início da viagem é obrigatória."
            );
        }

        if (request.dataFim() == null) {
            throw new RegraNegocioException(
                "A data de fim da viagem é obrigatória."
            );
        }

        if (request.dataFim().isBefore(request.dataInicio())) {
            throw new RegraNegocioException(
                "A data de fim não pode ser anterior à data de início."
            );
        }


        // -------------------------------------------------------------
        // Origem
        // -------------------------------------------------------------

        if (request.idOrigem() == null) {
            throw new RegraNegocioException(
                "A cidade de origem é obrigatória."
            );
        }


        // -------------------------------------------------------------
        // Destino
        // -------------------------------------------------------------

        if (request.idDestino() == null) {
            throw new RegraNegocioException(
                "A cidade de destino é obrigatória."
            );
        }


        if (request.idOrigem().equals(request.idDestino())) {
            throw new RegraNegocioException(
                "A cidade de origem deve ser diferente "
                + "da cidade de destino."
            );
        }


        // -------------------------------------------------------------
        // Motivo
        // -------------------------------------------------------------

        if (request.idMotivo() == null) {
            throw new RegraNegocioException(
                "O motivo da viagem é obrigatório."
            );
        }


        // -------------------------------------------------------------
        // Meio de transporte
        // -------------------------------------------------------------

        if (request.idsMeiosTransporte() == null
            || request.idsMeiosTransporte().isEmpty()) {
            throw new RegraNegocioException(
                "Informe pelo menos um meio de transporte."
            );
        }


        // -------------------------------------------------------------
        // Solicitante
        // -------------------------------------------------------------

        if (request.matriculaSolicitante() == null
            || request.matriculaSolicitante().isBlank()) {

            throw new RegraNegocioException(
                "A matrícula do solicitante é obrigatória."
            );
        }


        // -------------------------------------------------------------
        // Formato da matrícula
        // -------------------------------------------------------------

        if (!request.matriculaSolicitante().matches(
            "\\d{4}-\\d"
        )) {

            throw new RegraNegocioException(
                "A matrícula deve possuir o formato XXXX-X."
            );
        }
    }

    /**
     * Lista o histórico de status de uma viagem.
     */
    @Transactional(readOnly = true)
    public List<HistoricoStatusResponse> listarHistorico(
        Integer idViagem
    ) {
        viagemRepository.findById(idViagem)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Viagem não encontrada (ID: " + idViagem + ")"
            ));

        return historicoStatusRepository
            .findByViagemId(idViagem)
            .stream()
            .map(HistoricoStatusResponse::de)
            .toList();
    }
}