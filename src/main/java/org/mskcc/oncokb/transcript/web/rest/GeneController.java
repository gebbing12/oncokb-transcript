package org.mskcc.oncokb.transcript.web.rest;

import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.genome_nexus.ApiException;
import org.mskcc.oncokb.transcript.domain.Gene;
import org.mskcc.oncokb.transcript.repository.GeneRepository;
import org.mskcc.oncokb.transcript.service.GeneService;
import org.mskcc.oncokb.transcript.web.rest.vm.MatchTranscriptVM;
import org.mskcc.oncokb.transcript.web.rest.vm.TranscriptMatchResultVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class GeneController {

    private final Logger log = LoggerFactory.getLogger(GeneController.class);

    private final GeneService geneService;

    private final GeneRepository geneRepository;

    public GeneController(GeneService geneService, GeneRepository geneRepository) {
        this.geneService = geneService;
        this.geneRepository = geneRepository;
    }

    /**
     * {@code GET  /get-gene/{symbol}} : get the gene by symbol.
     *
     * @param symbol the id of the gene to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gene, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/find-gene/{symbol}")
    public ResponseEntity<Gene> findGeneBySymbol(@PathVariable String symbol) {
        log.debug("REST request to find Gene : {}", symbol);
        return ResponseUtil.wrapOrNotFound(getGeneBySymbol(symbol));
    }

    @PostMapping("/find-gene")
    public ResponseEntity<Set<Gene>> findGenesBySymbols(@RequestBody List<String> body) {
        Set<Gene> genes = new HashSet<>();
        if (body != null) {
            body
                .stream()
                .forEach(
                    symbol -> {
                        Optional<Gene> geneOptional = getGeneBySymbol(symbol);
                        if (geneOptional.isPresent()) {
                            genes.add(geneOptional.get());
                        }
                    }
                );
        }
        return new ResponseEntity<>(genes, HttpStatus.OK);
    }

    private Optional<Gene> getGeneBySymbol(String symbol) {
        Optional<Gene> gene;
        if (StringUtils.isNumeric(symbol)) {
            gene = geneService.findGeneByEntrezGeneId(Integer.parseInt(symbol));
        } else {
            gene = geneService.findGeneByHugoSymbol(symbol);
            if (gene.isEmpty()) {
                gene = geneService.findGeneByAlias(symbol);
            }
        }
        return gene;
    }
}
