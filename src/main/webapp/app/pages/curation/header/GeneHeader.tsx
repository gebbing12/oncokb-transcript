import { CBIOPORTAL, COSMIC } from 'app/config/constants/constants';
import ExternalLinkIcon from 'app/shared/icons/ExternalLinkIcon';
import { HgncLink } from 'app/shared/links/HgncLink';
import { PubmedGeneLink } from 'app/shared/links/PubmedGeneLink';
import { componentInject } from 'app/shared/util/typed-inject';
import { IRootStore } from 'app/stores';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import WithSeparator from 'react-with-separator';
import { InlineDivider } from 'app/shared/links/PubmedGeneArticlesLink';
import { onValue, ref } from 'firebase/database';
import { geneMetaReviewHasUuids, getFirebaseMetaGenePath } from 'app/shared/util/firebase/firebase-utils';
import { IGene } from 'app/shared/model/gene.model';
import { MetaReview } from 'app/shared/model/firebase/firebase.model';
import { Button } from 'reactstrap';
import CommentIcon from 'app/shared/icons/CommentIcon';
import SomaticGermlineToggleButton from '../button/SomaticGermlineToggleButton';

export interface IGeneHeaderProps extends StoreProps {
  hugoSymbol: string;
  firebaseGenePath: string;
  geneName: string;
  geneEntity: IGene;
  isReviewing: boolean;
  isReviewFinished: boolean;
  isGermline: boolean;
  handleReviewFinished: (isFinished: boolean) => void;
}

const GeneHeader = ({
  hugoSymbol,
  fullName,
  updateMeta,
  firebaseDb,
  firebaseGenePath,
  geneName,
  geneEntity,
  isReviewing,
  isReviewFinished,
  isGermline,
  handleReviewFinished,
}: IGeneHeaderProps) => {
  const firebaseMetaPath = getFirebaseMetaGenePath(isGermline, geneName);
  const [metaReview, setMetaReview] = useState<MetaReview>(undefined);

  useEffect(() => {
    const subscribe = onValue(ref(firebaseDb, `${firebaseMetaPath}/review`), snapshot => {
      setMetaReview(snapshot.val());
    });
    return () => subscribe?.();
  }, []);

  const handleReviewButtonClick = () => {
    if (isReviewing) {
      handleReviewFinished(false);
    }
    updateMeta(`${firebaseMetaPath}`, { review: { currentReviewer: isReviewing ? '' : fullName } });
  };

  const getReviewButton = () => {
    let button;
    if (geneMetaReviewHasUuids(metaReview)) {
      if (isReviewing || isReviewFinished) {
        button = (
          <Button color="primary" onClick={handleReviewButtonClick}>
            Review Complete
          </Button>
        );
      } else {
        button = (
          <Button outline color="primary" onClick={handleReviewButtonClick}>
            Review
          </Button>
        );
      }
    } else {
      if (isReviewFinished) {
        button = (
          <Button color="primary" onClick={handleReviewButtonClick}>
            Review Complete
          </Button>
        );
      } else {
        return undefined;
      }
    }
    return <>{button}</>;
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-1">
          <span style={{ fontSize: '3rem', lineHeight: 1 }} className={'mr-3'}>
            {geneName}
          </span>
          {!isReviewing && <CommentIcon id={`${geneName}_curation_page`} path={`${firebaseGenePath}/name_comments`} />}
          <div className="ml-3">
            <SomaticGermlineToggleButton hugoSymbol={hugoSymbol} />
          </div>
        </div>
        {getReviewButton()}
      </div>
      {!isReviewing && (
        <>
          <span>
            {geneEntity?.entrezGeneId && (
              <span>
                <span className="font-weight-bold text-nowrap">Entrez Gene:</span>
                <span className="ml-1">
                  <PubmedGeneLink entrezGeneId={geneEntity.entrezGeneId} />
                </span>
              </span>
            )}
            {geneEntity?.hgncId && (
              <span className="ml-2">
                <span className="font-weight-bold">HGNC:</span>
                <span className="ml-1">
                  <HgncLink id={geneEntity.hgncId} />
                </span>
              </span>
            )}
            {geneEntity?.synonyms && geneEntity.synonyms.length > 0 && (
              <span className="ml-2">
                <span className="font-weight-bold">Gene aliases:</span>
                <span className="ml-1">
                  <WithSeparator separator={', '}>
                    {geneEntity.synonyms.map(synonym => (
                      <span className={'text-nowrap'} key={synonym.name}>
                        {synonym.name}
                      </span>
                    ))}
                  </WithSeparator>
                </span>
              </span>
            )}
            <span className="ml-2">
              <span className="font-weight-bold mr-2">External Links:</span>
              <WithSeparator separator={InlineDivider}>
                <a href={`https://cbioportal.mskcc.org/ln?q=${geneName}`} target="_blank" rel="noopener noreferrer">
                  {CBIOPORTAL} <ExternalLinkIcon />
                </a>
                <a href={`http://cancer.sanger.ac.uk/cosmic/gene/overview?ln=${geneName}`} target="_blank" rel="noopener noreferrer">
                  {COSMIC} <ExternalLinkIcon />
                </a>
              </WithSeparator>
            </span>
          </span>
        </>
      )}
    </div>
  );
};

const mapStoreToProps = ({ firebaseStore, firebaseMetaStore, authStore }: IRootStore) => ({
  firebaseDb: firebaseStore.firebaseDb,
  updateMeta: firebaseMetaStore.update,
  fullName: authStore.fullName,
});

type StoreProps = Partial<ReturnType<typeof mapStoreToProps>>;

export default componentInject(mapStoreToProps)(observer(GeneHeader));