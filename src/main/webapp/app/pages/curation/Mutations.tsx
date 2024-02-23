import MutationCollapsible from 'app/pages/curation/collapsible/MutationCollapsible';
import { ViewportList } from 'react-viewport-list';
import React, { useRef } from 'react';
import { action, computed, IObservableArray, makeObservable, observable } from 'mobx';
import { Database, onChildAdded, onChildRemoved, onValue, ref } from 'firebase/database';
import { IRootStore } from 'app/stores';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'reactstrap';
import { ParsedHistoryRecord } from 'app/pages/curation/CurationPage';
import { IDrug } from 'app/shared/model/drug.model';

type StoreProps = {
  db: Database;
};

interface IMutations extends StoreProps {
  fieldKey: string;
  historyData: Map<string, ParsedHistoryRecord[]>;
  drugList: IDrug[];
}

@observer
class Mutations extends React.Component<IMutations> {
  listeners = [];
  mutations = observable.array([]);

  constructor(props) {
    super(props);
    makeObservable(this, {
      mutations: observable,
      addListeners: action.bound,
      mutationCollapsibles: computed,
    });
    this.addListeners();
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => listener && listener());
  }

  addListeners() {
    const mutationsRef = ref(this.props.db, this.props.fieldKey);
    this.listeners.push(
      onChildAdded(
        mutationsRef,
        action(snapshot => {
          console.log('Mutation added', snapshot.val());
          this.mutations.push(snapshot.val());
        })
      )
    );
    this.listeners.push(
      onChildRemoved(
        mutationsRef,
        action(snapshot => {
          console.log('Mutation removed', snapshot.val());
          const mutToRemove = this.mutations.filter(mut => mut.name_uuid === snapshot.val().name_uuid);
          this.mutations.remove(mutToRemove);
        })
      )
    );
  }

  get mutationCollapsibles() {
    return (
      <div>
        {this.mutations.map((mutation, index) => (
          <Row key={index} className={'mb-2'}>
            <Col>
              <MutationCollapsible
                mutation={mutation}
                firebaseIndex={index}
                parsedHistoryList={this.props.historyData}
                drugList={this.props.drugList}
              />
            </Col>
          </Row>
        ))}
      </div>
    );
  }

  render() {
    return (
      <>
        {this.mutations ? (
          <div className={'mb-5'}>
            <Row>
              <Col>
                <div className={'d-flex justify-content-between align-items-center mb-2'}>
                  <div className="mb-2 d-flex align-items-center">
                    <h5 className="mb-0 mr-2">Mutations:</h5>{' '}
                  </div>
                </div>
              </Col>
            </Row>
            {this.mutationCollapsibles}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

const mapStoreToProps = ({ firebaseGeneStore }: IRootStore) => ({
  db: firebaseGeneStore.db,
});
export default inject(mapStoreToProps)(Mutations);
