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

import br.unioeste.backend.dto.AlterarStatusRequest;
import br.unioeste.backend.dto.CriarViagemRequest;
import br.unioeste.backend.dto.ViagemResponse;
import br.unioeste.backend.service.ViagemService;
import br.unioeste.backend.dto.AtualizarViagemRequest;
import org.springframework.web.bind.annotation.PutMapping;
import br.unioeste.backend.dto.HistoricoStatusResponse;
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
        return ResponseEntity.ok(viagemService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ViagemResponse> cadastrar(
        @Valid @RequestBody CriarViagemRequest request
    ) {
        ViagemResponse response = viagemService.cadastrar(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
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

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
        @PathVariable Integer id,
        @Valid @RequestBody AlterarStatusRequest request
    ) {
        viagemService.alterarStatus(id, request);

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