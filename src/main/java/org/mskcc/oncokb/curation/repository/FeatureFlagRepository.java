package org.mskcc.oncokb.curation.repository;

import java.util.List;
import java.util.Optional;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.mskcc.oncokb.curation.domain.FeatureFlag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FeatureFlag entity.
 */
@JaversSpringDataAuditable
@Repository
public interface FeatureFlagRepository extends JpaRepository<FeatureFlag, Long>, JpaSpecificationExecutor<FeatureFlag> {
    @Query(
        value = "select distinct featureFlag from FeatureFlag featureFlag left join fetch featureFlag.users",
        countQuery = "select count(distinct featureFlag) from FeatureFlag featureFlag"
    )
    Page<FeatureFlag> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct featureFlag from FeatureFlag featureFlag left join fetch featureFlag.users")
    List<FeatureFlag> findAllWithEagerRelationships();

    @Query("select featureFlag from FeatureFlag featureFlag left join fetch featureFlag.users where featureFlag.id =:id")
    Optional<FeatureFlag> findOneWithEagerRelationships(@Param("id") Long id);
}