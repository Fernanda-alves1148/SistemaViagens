package br.unioeste.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unioeste.backend.dto.AcaoStatusViagemRequest;
import br.unioeste.backend.dto.AtualizarViagemRequest;
import br.unioeste.backend.dto.CriarViagemRequest;
import br.unioeste.backend.dto.HistoricoStatusResponse;
import br.unioeste.backend.dto.ViagemResponse;
import br.unioeste.backend.service.ViagemService;

@RestController
@RequestMapping("/api/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @GetMapping
    public ResponseEntity<List<ViagemResponse>> listar() {
        return ResponseEntity.ok(viagemService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemResponse> buscarPorId(
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
            viagemService.buscarPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<ViagemResponse> cadastrar(
        @Valid @RequestBody CriarViagemRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(viagemService.cadastrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViagemResponse> atualizar(
        @PathVariable Integer id,
        @Valid @RequestBody AtualizarViagemRequest request
    ) {
        return ResponseEntity.ok(
            viagemService.atualizar(id, request)
        );
    }

    @PatchMapping("/{id}/solicitar")
    public ResponseEntity<Void> solicitar(
        @PathVariable Integer id,
        @Valid @RequestBody AcaoStatusViagemRequest request
    ) {
        viagemService.solicitar(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
        @PathVariable Integer id,
        @Valid @RequestBody AcaoStatusViagemRequest request
    ) {
        viagemService.cancelar(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/solicitar-ajustes")
    public ResponseEntity<Void> solicitarAjustes(
        @PathVariable Integer id,
        @Valid @RequestBody AcaoStatusViagemRequest request
    ) {
        viagemService.solicitarAjustes(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Void> aprovar(
        @PathVariable Integer id,
        @Valid @RequestBody AcaoStatusViagemRequest request
    ) {
        viagemService.aprovar(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<Void> rejeitar(
        @PathVariable Integer id,
        @Valid @RequestBody AcaoStatusViagemRequest request
    ) {
        viagemService.rejeitar(id, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoStatusResponse>> listarHistorico(
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
            viagemService.listarHistorico(id)
        );
    }
}