import { componentInject } from 'app/shared/util/typed-inject';
import { IRootStore } from 'app/stores';
import { observer } from 'mobx-react';
import React from 'react';
import NestLevelSummary from './NestLevelSummary';
import { Database, onValue, ref } from 'firebase/database';
import { getMutationState } from 'app/shared/util/firebase/firebase-utils';
import { action, makeObservable, observable } from 'mobx';

export interface MutationLevelSummaryProps extends StoreProps {
  mutationPath: string;
  hideOncogenicity?: boolean;
}

class MutationLevelSummary extends React.Component<MutationLevelSummaryProps> {
  listener = undefined;
  mutation = undefined;

  constructor(props) {
    super(props);
    this.addListener();
    makeObservable(this, {
      mutation: observable,
    });
  }

  get mutationStat() {
    return getMutationState(this.mutation);
  }

  componentWillUnmount() {
    this.listener && this.listener();
  }

  addListener() {
    console.log('attach mutationPath', this.props.mutationPath);
    const unsubscribe = onValue(
      ref(this.props.db, this.props.mutationPath),
      action(snapshot => {
        this.mutation = snapshot.val() || '';
      }),
      e => {
        /* eslint-disable no-console */
        console.log('Add listener for RealtimeBasicInput', 'cancelled', e);
      }
    );
    return unsubscribe;
  }

  render() {
    return <NestLevelSummary summaryStats={this.mutationStat} hideOncogenicity={this.props.hideOncogenicity} />;
  }
}

const mapStoreToProps = ({ firebaseGeneStore }: IRootStore) => ({
  db: firebaseGeneStore.db,
  mutationSummaryStats: firebaseGeneStore.mutationLevelMutationSummaryStats,
});

type StoreProps = {
  db?: Database;
  mutationSummaryStats?: MutationLevelSummary;
};

export default componentInject(mapStoreToProps)(observer(MutationLevelSummary));
