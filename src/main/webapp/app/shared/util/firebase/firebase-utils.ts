import { UUID_REGEX } from 'app/config/constants/constants';
import {
  Comment,
  DrugCollection,
  Gene,
  Meta,
  Mutation,
  Review,
  TX_LEVELS,
  Tumor,
  Alteration,
  DX_LEVELS,
  PX_LEVELS,
} from 'app/shared/model/firebase/firebase.model';
import { replaceUrlParams } from '../url-utils';
import { FB_COLLECTION_PATH } from 'app/config/constants/firebase';
import { parseFirebaseGenePath } from './firebase-path-utils';
import { NestLevelType, RemovableNestLevel } from 'app/pages/curation/collapsible/NestLevel';
import { IDrug } from 'app/shared/model/drug.model';
import mutations from 'app/pages/curation/Mutations';

/* Convert a nested object into an object where the key is the path to the object.
  Example:
    {type: {ocg: 'Oncogene}, name: 'ABL1' }
    is converted to
    {'type/ocg': 'Oncogene', 'name': 'ABL1'}
*/
export const convertNestedObject = (obj: any, key = '', result = {}) => {
  if (typeof obj !== 'object') {
    result[key] = obj;
    return result;
  }
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const newKey = key ? key + '/' + keys[i] : keys[i];
    convertNestedObject(obj[keys[i]], newKey, result);
  }

  return result;
};

export const getValueByNestedKey = (obj: any, nestedKey = '') => {
  return nestedKey.split('/').reduce((currObj, currKey) => {
    if (currObj) return currObj[currKey];
  }, obj);
};

export const isDnaVariant = (alteration: Alteration) => {
  return alteration.alteration && alteration.alteration.startsWith('c.');
};

export const getAlterationName = (alteration: Alteration) => {
  if (alteration.alteration) {
    let name = alteration.alteration;
    if (alteration.proteinChange && alteration.proteinChange !== alteration.alteration) {
      name += ` (p.${alteration.proteinChange})`;
    }
    return name;
  } else if (alteration.proteinChange) {
    return alteration.proteinChange;
  }
  return '';
};
export const getMutationName = (mutation: Mutation) => {
  const defaultNoName = '(No Name)';
  if (mutation.alterations) {
    return mutation.alterations.map(alteration => getAlterationName(alteration)).join(', ');
  }
  if (mutation.name) {
    return mutation.name;
  } else {
    return defaultNoName;
  }
};

export const getMutationState = (mutation?: Mutation) => {
  const stats = {
    TT: 0,
    oncogenicity: mutation?.mutation_effect.oncogenic,
    mutationEffect: mutation?.mutation_effect.effect,
    TTS: 0,
    DxS: 0,
    PxS: 0,
    txLevels: {} as { [txLevel in TX_LEVELS]: number },
    dxLevels: {} as { [dxLevel in DX_LEVELS]: number },
    pxLevels: {} as { [pxLevel in PX_LEVELS]: number },
  };
  if (mutation?.tumors) {
    mutation.tumors.forEach(tumor => {
      stats.TT++;
      if (tumor.summary) {
        stats.TTS++;
      }
      if (tumor.diagnosticSummary) {
        stats.DxS++;
      }
      if (tumor.prognosticSummary) {
        stats.PxS++;
      }
      tumor.TIs.forEach(ti => {
        if (ti.treatments) {
          ti.treatments.forEach(treatment => {
            if (!stats.txLevels[treatment.level]) {
              stats.txLevels[treatment.level] = 1;
            } else {
              stats.txLevels[treatment.level]++;
            }
          });
        }
      });
      if (tumor?.diagnostic?.level) {
        if (!stats.dxLevels[tumor.diagnostic.level]) {
          stats.dxLevels[tumor.diagnostic.level] = 1;
        } else {
          stats.dxLevels[tumor.diagnostic.level]++;
        }
      }
      if (tumor?.prognostic?.level) {
        if (!stats.dxLevels[tumor.prognostic.level]) {
          stats.dxLevels[tumor.prognostic.level] = 1;
        } else {
          stats.dxLevels[tumor.prognostic.level]++;
        }
      }
    });
  }
  return stats;
};
export const getTxName = (drugList: IDrug[], txUuidName: string) => {
  return txUuidName
    .split(',')
    .map(tx => {
      return tx
        .split('+')
        .map(drug => {
          drug = drug.trim();
          const drugInList = drugList.find(d => d.uuid === drug);
          return drugInList ? drugInList.name : drug;
        })
        .join(' + ');
    })
    .join(', ');
};

export const geneNeedsReview = (meta: Meta | undefined) => {
  let needsReview = false;
  const metaReview = meta?.review;
  if (metaReview) {
    needsReview = !!Object.keys(metaReview).find(key => UUID_REGEX.test(key));
  }
  return needsReview;
};

export const getFirebasePath = (type: keyof typeof FB_COLLECTION_PATH, ...params: (string | number)[]) => {
  return replaceUrlParams(FB_COLLECTION_PATH[type], ...params);
};

export function getMostRecentComment(comments: Comment[]) {
  let latestComment = comments[0];
  for (const comment of comments) {
    if (parseInt(comment.date, 10) > parseInt(latestComment.date, 10)) {
      latestComment = comment;
    }
  }
  return latestComment;
}

export const isSectionRemovableWithoutReview = (geneData: Gene, nestLevel: RemovableNestLevel, fullPath: string) => {
  let reviewKey;
  if (nestLevel === NestLevelType.MUTATION || nestLevel === NestLevelType.THERAPY) {
    reviewKey = 'name_review';
  } else {
    reviewKey = 'cancerTypes_review';
  }

  const pathDetails = parseFirebaseGenePath(fullPath);

  const review: Review = getValueByNestedKey(geneData, `${pathDetails.pathFromGene}/${reviewKey}`);
  return !!review && !!review.added;
};

export function isNestedObjectEmpty(obj: any, ignoredKeySubstrings: string[] = []) {
  if (typeof obj === 'object' && obj !== undefined && obj !== null) {
    let targetKeys = Object.keys(obj);
    if (ignoredKeySubstrings !== undefined && ignoredKeySubstrings.length > 0) {
      targetKeys = Object.keys(obj).filter(key => !ignoredKeySubstrings.some(suffix => key.includes(suffix)));
    }
    let isEmpty = true;
    for (const key of targetKeys) {
      isEmpty = isEmpty && isNestedObjectEmpty(obj[key], ignoredKeySubstrings);
      if (!isEmpty) {
        return false;
      }
    }
    return true;
  }

  if (obj === undefined || obj === null) {
    return true;
  }

  if (typeof obj === 'string') {
    return obj.trim().length === 0;
  }

  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  return false;
}

export const isSectionEmpty = (geneData: Gene, fullPath: string) => {
  const path = parseFirebaseGenePath(fullPath).pathFromGene;
  const value = getValueByNestedKey(geneData, path);
  if (value === undefined) {
    return true;
  }

  const ignoredKeySuffixes = ['_review', '_uuid', 'TIs', 'cancerTypes'];
  const isEmpty = isNestedObjectEmpty(value, ignoredKeySuffixes);

  if (!isEmpty) {
    return isEmpty;
  }

  // If the section is not empty, we still need to check if there are treatments in the TIs array.
  // We skipped the TIs key because TI.name and TI.type always has a value, which will
  // make our function always return isEmpty=False
  if (path.match(/tumors\/\d+$/g)) {
    const implications = (value as Tumor).TIs;
    for (const implication of implications) {
      if (implication.treatments && implication.treatments.length > 0) {
        return false;
      }
    }
  }
  return isEmpty;
};

export const isPendingDelete = (geneData: Gene, nestLevel: RemovableNestLevel, path: string) => {
  const key = parseFirebaseGenePath(path).pathFromGene;
  let reviewKey = key;
  if (nestLevel === NestLevelType.CANCER_TYPE) {
    reviewKey += '/cancerTypes_review';
  } else {
    reviewKey += '/name_review';
  }
  const review = getValueByNestedKey(geneData, reviewKey);
  if ((review as Review)?.removed) {
    return true;
  }
  return false;
};

export const sortByTxLevel = (a: TX_LEVELS, b: TX_LEVELS) => {
  const ordering = [
    TX_LEVELS.LEVEL_1,
    TX_LEVELS.LEVEL_R1,
    TX_LEVELS.LEVEL_2,
    TX_LEVELS.LEVEL_3A,
    TX_LEVELS.LEVEL_3B,
    TX_LEVELS.LEVEL_4,
    TX_LEVELS.LEVEL_R2,
    TX_LEVELS.LEVEL_R3,
  ];
  const aIndex = ordering.indexOf(a);
  const bIndex = ordering.indexOf(b);
  if (aIndex === bIndex) {
    return 0;
  }
  if (aIndex === -1) {
    return 1;
  }
  if (bIndex === -1) {
    return -1;
  }
  return aIndex > bIndex ? 1 : -1;
};
