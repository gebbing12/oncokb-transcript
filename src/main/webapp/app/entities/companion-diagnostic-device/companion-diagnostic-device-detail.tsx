import React, { useEffect } from 'react';
import { connect } from 'app/shared/util/typed-inject';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootStore } from 'app/stores';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, PAGE_ROUTE } from 'app/config/constants';
import WithSeparator from 'react-with-separator';
export interface ICompanionDiagnosticDeviceDetailProps extends StoreProps, RouteComponentProps<{ id: string }> {}

export const CompanionDiagnosticDeviceDetail = (props: ICompanionDiagnosticDeviceDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const companionDiagnosticDeviceEntity = props.companionDiagnosticDeviceEntity;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="companionDiagnosticDeviceDetailsHeading">CompanionDiagnosticDevice</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{companionDiagnosticDeviceEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{companionDiagnosticDeviceEntity.name}</dd>
          <dt>
            <span id="manufacturer">Manufacturer</span>
          </dt>
          <dd>{companionDiagnosticDeviceEntity.manufacturer}</dd>
          <dt>Specimen Type</dt>
          <dd>
            <WithSeparator separator={', '}>
              {(companionDiagnosticDeviceEntity.specimenTypes || []).map((val, i) => (
                <Link to={`${PAGE_ROUTE.SPECIMEN_TYPE}/${val.id}`} key={val.type}>
                  {`${val.name}(${val.type})`}
                </Link>
              ))}
            </WithSeparator>
          </dd>
        </dl>
        <Button tag={Link} to={`/companion-diagnostic-device/${companionDiagnosticDeviceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStoreToProps = ({ companionDiagnosticDeviceStore }: IRootStore) => ({
  companionDiagnosticDeviceEntity: companionDiagnosticDeviceStore.entity,
  getEntity: companionDiagnosticDeviceStore.getEntity,
});

type StoreProps = ReturnType<typeof mapStoreToProps>;

export default connect(mapStoreToProps)(CompanionDiagnosticDeviceDetail);
