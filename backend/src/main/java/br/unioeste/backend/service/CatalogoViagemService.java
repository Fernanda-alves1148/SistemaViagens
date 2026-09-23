package br.unioeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.CidadeResponse;
import br.unioeste.backend.dto.OpcaoResponse;
import br.unioeste.backend.repository.CidadeRepository;
import br.unioeste.backend.repository.MeioTransporteRepository;
import br.unioeste.backend.repository.MotivoRepository;

@Service
public class CatalogoViagemService {

    private final CidadeRepository cidadeRepository;
    private final MotivoRepository motivoRepository;
    private final MeioTransporteRepository meioRepository;

    public CatalogoViagemService(
        CidadeRepository cidadeRepository,
        MotivoRepository motivoRepository,
        MeioTransporteRepository meioRepository
    ) {
        this.cidadeRepository = cidadeRepository;
        this.motivoRepository = motivoRepository;
        this.meioRepository = meioRepository;
    }

    @Transactional(readOnly = true)
    public List<CidadeResponse> listarCidades() {
        return cidadeRepository.findAll()
            .stream()
            .map(cidade -> new CidadeResponse(
                cidade.getId(),
                cidade.getNome(),
                cidade.getSiglaUf()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<OpcaoResponse> listarMotivos() {
        return motivoRepository.findAll()
            .stream()
            .map(motivo -> new OpcaoResponse(
                motivo.getId(),
                motivo.getNome()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<OpcaoResponse> listarMeiosTransporte() {
        return meioRepository.findAll()
            .stream()
            .map(meio -> new OpcaoResponse(
                meio.getId(),
                meio.getNome()
            ))
            .toList();
    }
}