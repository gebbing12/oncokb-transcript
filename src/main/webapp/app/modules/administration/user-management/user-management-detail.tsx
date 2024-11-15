import React, { useEffect } from 'react';
import { connect } from 'app/shared/util/typed-inject';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Badge, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { APP_DATE_FORMAT, ENTITY_ACTION, ENTITY_TYPE } from 'app/config/constants/constants';
import { IRootStore } from 'app/stores/createStore';
import EntityActionButton from 'app/shared/button/EntityActionButton';
import { ENTITY_PAGE_ROUTE, USER_AUTHORITY } from 'app/config/constants/constants';
import ExternalLinkIcon from 'app/shared/icons/ExternalLinkIcon';

export interface IUserManagementDetailProps extends StoreProps, RouteComponentProps<{ login: string }> {}

export const UserManagementDetail = (props: IUserManagementDetailProps) => {
  useEffect(() => {
    props.getUser(props.match.params.login);
  }, []);

  const { user } = props;

  return (
    <Row size="md">
      <Col md="8">
        <dl className="jh-entity-details">
          <dt>Login</dt>
          <dd>
            <span>{user.login}</span>&nbsp;
            {user.activated ? <Badge color="success">Activated</Badge> : <Badge color="danger">Deactivated</Badge>}
          </dd>
          <dt>First Name</dt>
          <dd>{user.firstName}</dd>
          <dt>Last Name</dt>
          <dd>{user.lastName}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Lang Key</dt>
          <dt>Created By</dt>
          <dd>{user.createdBy}</dd>
          <dt>Created Date</dt>
          <dd>{user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}</dd>
          <dt>Last Modified By</dt>
          <dd>{user.lastModifiedBy}</dd>
          <dt>Last Modified Date</dt>
          <dd>
            {user.lastModifiedDate ? (
              <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
            ) : null}
          </dd>
          <dt>Profiles</dt>
          <dd>
            <ul className="list-unstyled">
              {user.authorities
                ? user.authorities.map((authority, i) => (
                    <li key={`user-auth-${i}`}>
                      <Badge color="info">{authority}</Badge>
                    </li>
                  ))
                : null}
            </ul>
          </dd>
          {user?.authorities?.includes(USER_AUTHORITY.ROLE_DEV) && (
            <>
              <dt>Feature Flag</dt>
              <dd>
                {user.featureFlags
                  ? user.featureFlags.map((featureFlag, i) => (
                      <div key={`user-feature-flag-${i}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <p style={{ marginBottom: 0, marginRight: '0.5rem' }}>{featureFlag.name}</p>
                        <a
                          href={`${ENTITY_PAGE_ROUTE.FEATURE_FLAG}/${featureFlag.id}`}
                          style={{ alignContent: 'flex-end' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon />
                        </a>
                      </div>
                    ))
                  : null}
              </dd>
            </>
          )}
        </dl>
        <EntityActionButton color="primary" entityId={user.login} entityType={ENTITY_TYPE.USER} entityAction={ENTITY_ACTION.EDIT} />
      </Col>
    </Row>
  );
};

const mapStoreToProps = (storeState: IRootStore) => ({
  user: storeState.userStore.entity,
  getUser: storeState.userStore.getEntity,
});

type StoreProps = ReturnType<typeof mapStoreToProps>;

export default connect(mapStoreToProps)(UserManagementDetail);
