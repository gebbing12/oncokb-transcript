import classNames from 'classnames';
import React, { Component, useCallback, useEffect, useState } from 'react';
import { Input, Label, LabelProps, Row } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';
import classnames from 'classnames';
import { IRootStore } from 'app/stores';
import { RealtimeInputType } from './FirebaseRealtimeInput';
import { inject, observer, Observer } from 'mobx-react';
import { getFirebasePath, getValueByNestedKey } from 'app/shared/util/firebase/firebase-utils';
import { action, computed, makeObservable, observable } from 'mobx';
import { Database, onValue, ref } from 'firebase/database';

export interface IRealtimeBasicLabel extends LabelProps {
  id: string;
  label: string;
  labelClass?: string;
  labelIcon?: JSX.Element;
}

export const RealtimeBasicLabel: React.FunctionComponent<IRealtimeBasicLabel> = ({
  label,
  labelClass,
  labelIcon,
  id,
  ...labelProps
}: IRealtimeBasicLabel) => {
  const labelComponent = (
    <Label {...labelProps} id={id} for={id} className={classnames(labelClass, 'text-nowrap')}>
      <div className="d-flex align-items-center">
        {label}
        {labelIcon && <span className="mr-2" />}
        {labelIcon}
      </div>
    </Label>
  );
  return labelComponent;
};

export type RealtimeBasicInputType = Exclude<RealtimeInputType, RealtimeInputType.DROPDOWN>;

export interface IRealtimeBasicInput extends React.InputHTMLAttributes<HTMLInputElement>, StoreProps {
  fieldKey: string;
  type: RealtimeBasicInputType;
  label: string;
  labelClass?: string;
  labelIcon?: JSX.Element;
  inputClass?: string;
}

@observer
export class RealtimeBasicInput extends Component<IRealtimeBasicInput, any> {
  readonly db: Database = undefined;
  readonly hugoSymbol = '';
  inputValue = '';
  listener = undefined;

  checkTypeCss: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  constructor(props) {
    super(props);
    this.db = props.db;
    this.hugoSymbol = props.hugoSymbol;
    this.listener = this.addListener();
    makeObservable(this, {
      db: observable,
      addListener: action.bound,
      inputChangeHandler: action.bound,
      inputValue: observable,
      isCheckType: computed,
      isInlineInputText: computed,
      inputComponent: computed,
    });
  }

  componentWillUnmount() {
    this.listener && this.listener();
  }

  addListener() {
    console.log('attach field key', this.props.fieldKey);
    const unsubscribe = onValue(
      ref(this.db, getFirebasePath('GENE', this.hugoSymbol) + '/' + this.props.fieldKey),
      action(snapshot => {
        this.inputValue = snapshot.val() || '';
      }),
      e => {
        /* eslint-disable no-console */
        console.log('Add listener for RealtimeBasicInput', 'cancelled', e);
      }
    );
    return unsubscribe;
  }

  get isCheckType() {
    return this.props.type === RealtimeInputType.CHECKBOX || this.props.type === RealtimeInputType.RADIO;
  }

  get isInlineInputText() {
    return this.props.type === RealtimeInputType.INLINE_TEXT;
  }

  getLabelComponent() {
    return (
      <RealtimeBasicLabel
        label={this.props.label}
        labelIcon={this.props.labelIcon}
        id={this.props.id}
        labelClass={this.isCheckType ? 'mb-0' : 'font-weight-bold'}
      />
    );
  }

  inputChangeHandler = e => {
    const updateValue = this.isCheckType ? (e.target.checked ? this.props.label : '') : e.target.value;
    this.props.updateReviewableContent(getFirebasePath('GENE', this.hugoSymbol), this.props.fieldKey, updateValue);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  get inputComponent() {
    return (
      <Input
        className={classNames(this.props.inputClass, this.isCheckType && 'ml-1 position-relative')}
        id={this.props.id}
        name={`${this.props.id}-${this.props.label.toLowerCase()}`}
        autoComplete="off"
        onChange={e => {
          this.inputChangeHandler(e);
        }}
        type={this.props.type as InputType}
        style={this.isCheckType ? { marginRight: '0.25rem' } : null}
        value={this.inputValue}
        checked={this.isCheckType && this.inputValue === this.props.label}
      >
        {this.props.children}
      </Input>
    );
  }

  render() {
    return (
      <div
        className={classNames(!this.isCheckType ? 'mb-2' : undefined, this.props.className)}
        style={this.isCheckType ? this.checkTypeCss : undefined}
      >
        {this.isCheckType ? (
          <>
            {this.inputComponent}
            {this.getLabelComponent()}
          </>
        ) : this.isInlineInputText ? (
          <div className={'d-flex'}>
            <div className={'mr-2 d-flex'}>{this.getLabelComponent()}:</div>
          </div>
        ) : (
          <>
            {this.getLabelComponent()}
            {this.inputComponent}
          </>
        )}
      </div>
    );
  }
}

const mapStoreToProps = ({ firebaseGeneStore }: IRootStore) => ({
  db: firebaseGeneStore.db,
  hugoSymbol: firebaseGeneStore.data.name,
  updateReviewableContent: firebaseGeneStore.updateReviewableContent,
});

type StoreProps = {
  updateReviewableContent?: (path: string, key: string, value: any) => void;
};

export default inject(mapStoreToProps)(RealtimeBasicInput);
