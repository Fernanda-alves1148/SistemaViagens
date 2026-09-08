package br.unioeste.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.unioeste.backend.dto.AlterarStatusRequest;
import br.unioeste.backend.dto.CriarViagemRequest;
import br.unioeste.backend.dto.ViagemResponse;
import br.unioeste.backend.service.ViagemService;

@RestController
@RequestMapping("/api/viagens")
@CrossOrigin(origins = "*")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    /**
     * Cadastra uma nova viagem.
     *
     * Toda nova viagem é criada inicialmente como "Rascunho".
     */
    @PostMapping
    public ResponseEntity<ViagemResponse> cadastrar(
        @RequestBody CriarViagemRequest request
    ) {

        ViagemResponse response = viagemService.cadastrar(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    /**
     * Altera o status de uma viagem.
     *
     * Exemplos:
     * - Rascunho -> Solicitada
     * - Rascunho -> Cancelada
     * - Solicitada -> Aprovada
     * - Solicitada -> Rejeitada
     * - Solicitada -> Ajustes
     * - Ajustes -> Solicitada
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
        @PathVariable Integer id,
        @RequestBody AlterarStatusRequest request
    ) {

        viagemService.alterarStatus(id, request);

        return ResponseEntity.noContent().build();
    }
}