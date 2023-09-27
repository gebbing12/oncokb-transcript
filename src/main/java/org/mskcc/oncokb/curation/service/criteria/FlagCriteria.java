package org.mskcc.oncokb.curation.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link org.mskcc.oncokb.curation.domain.Flag} entity. This class is used
 * in {@link org.mskcc.oncokb.curation.web.rest.FlagResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /flags?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class FlagCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter type;

    private StringFilter flag;

    private StringFilter name;

    private LongFilter transcriptId;

    private LongFilter geneId;

    private Boolean distinct;

    public FlagCriteria() {}

    public FlagCriteria(FlagCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.type = other.type == null ? null : other.type.copy();
        this.flag = other.flag == null ? null : other.flag.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.transcriptId = other.transcriptId == null ? null : other.transcriptId.copy();
        this.geneId = other.geneId == null ? null : other.geneId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public FlagCriteria copy() {
        return new FlagCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getType() {
        return type;
    }

    public StringFilter type() {
        if (type == null) {
            type = new StringFilter();
        }
        return type;
    }

    public void setType(StringFilter type) {
        this.type = type;
    }

    public StringFilter getFlag() {
        return flag;
    }

    public StringFilter flag() {
        if (flag == null) {
            flag = new StringFilter();
        }
        return flag;
    }

    public void setFlag(StringFilter flag) {
        this.flag = flag;
    }

    public StringFilter getName() {
        return name;
    }

    public StringFilter name() {
        if (name == null) {
            name = new StringFilter();
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public LongFilter getTranscriptId() {
        return transcriptId;
    }

    public LongFilter transcriptId() {
        if (transcriptId == null) {
            transcriptId = new LongFilter();
        }
        return transcriptId;
    }

    public void setTranscriptId(LongFilter transcriptId) {
        this.transcriptId = transcriptId;
    }

    public LongFilter getGeneId() {
        return geneId;
    }

    public LongFilter geneId() {
        if (geneId == null) {
            geneId = new LongFilter();
        }
        return geneId;
    }

    public void setGeneId(LongFilter geneId) {
        this.geneId = geneId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final FlagCriteria that = (FlagCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(type, that.type) &&
            Objects.equals(flag, that.flag) &&
            Objects.equals(name, that.name) &&
            Objects.equals(transcriptId, that.transcriptId) &&
            Objects.equals(geneId, that.geneId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, type, flag, name, transcriptId, geneId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FlagCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (type != null ? "type=" + type + ", " : "") +
            (flag != null ? "flag=" + flag + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (transcriptId != null ? "transcriptId=" + transcriptId + ", " : "") +
            (geneId != null ? "geneId=" + geneId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}