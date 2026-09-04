package br.unioeste.backend.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.CriarViagemRequest;
import br.unioeste.backend.dto.ViagemResponse;
import br.unioeste.backend.entity.Cidade;
import br.unioeste.backend.entity.MeioTransporte;
import br.unioeste.backend.entity.Motivo;
import br.unioeste.backend.entity.Responsavel;
import br.unioeste.backend.entity.StatusViagem;
import br.unioeste.backend.entity.Viagem;
import br.unioeste.backend.exception.RecursoNaoEncontradoException;
import br.unioeste.backend.exception.RegraNegocioException;
import br.unioeste.backend.repository.CidadeRepository;
import br.unioeste.backend.repository.MeioTransporteRepository;
import br.unioeste.backend.repository.MotivoRepository;
import br.unioeste.backend.repository.ResponsavelRepository;
import br.unioeste.backend.repository.StatusViagemRepository;
import br.unioeste.backend.repository.ViagemRepository;

@Service
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final CidadeRepository cidadeRepository;
    private final MotivoRepository motivoRepository;
    private final StatusViagemRepository statusRepository;
    private final ResponsavelRepository responsavelRepository;
    private final MeioTransporteRepository meioRepository;

    public ViagemService(
        ViagemRepository viagemRepository,
        CidadeRepository cidadeRepository,
        MotivoRepository motivoRepository,
        StatusViagemRepository statusRepository,
        ResponsavelRepository responsavelRepository,
        MeioTransporteRepository meioRepository
    ) {
        this.viagemRepository = viagemRepository;
        this.cidadeRepository = cidadeRepository;
        this.motivoRepository = motivoRepository;
        this.statusRepository = statusRepository;
        this.responsavelRepository = responsavelRepository;
        this.meioRepository = meioRepository;
    }

    @Transactional
    public ViagemResponse cadastrar(CriarViagemRequest request) {
        validar(request);

        Cidade origem = cidadeRepository.findById(request.idOrigem())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Cidade de origem não encontrada"
            ));

        Cidade destino = cidadeRepository.findById(request.idDestino())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Cidade de destino não encontrada"
            ));

        Motivo motivo = motivoRepository.findById(request.idMotivo())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Motivo não encontrado"
            ));

        Responsavel responsavel = responsavelRepository
            .findById(request.matriculaResponsavel())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Responsável não encontrado"
            ));

        StatusViagem status = statusRepository
            .findByNomeIgnoreCase("Rascunho")
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Status inicial Rascunho não encontrado"
            ));

        List<MeioTransporte> meiosEncontrados =
            meioRepository.findAllById(request.idsMeiosTransporte());

        if (meiosEncontrados.size() != request.idsMeiosTransporte().size()) {
            throw new RecursoNaoEncontradoException(
                "Um ou mais meios de transporte não foram encontrados"
            );
        }

        Set<MeioTransporte> meios =
            new LinkedHashSet<>(meiosEncontrados);

        Viagem viagem = new Viagem(
            request.dataInicio(),
            request.dataFim(),
            origem,
            destino,
            motivo,
            status,
            responsavel,
            meios
        );

        Viagem viagemSalva = viagemRepository.save(viagem);

        return ViagemResponse.de(viagemSalva);
    }

    @Transactional(readOnly = true)
    public List<ViagemResponse> listar() {
        return viagemRepository.findAll()
            .stream()
            .map(ViagemResponse::de)
            .toList();
    }

    private void validar(CriarViagemRequest request) {
        if (request.dataFim().isBefore(request.dataInicio())) {
            throw new RegraNegocioException(
                "A data final não pode ser anterior à data inicial"
            );
        }

        if (request.idOrigem().equals(request.idDestino())) {
            throw new RegraNegocioException(
                "A origem e o destino devem ser diferentes"
            );
        }
    }
}