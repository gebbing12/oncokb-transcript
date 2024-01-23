import { action, makeObservable, observable } from 'mobx';
import { CancerTypeSelectOption } from '../select/CancerTypeSelect';

export class ModifyCancerTypeModalStore {
  public openCancerTypesUuid: string = null;
  public includedCancerTypes: CancerTypeSelectOption[] = [];
  public excludedCancerTypes: CancerTypeSelectOption[] = [];
  public isErrorFetchingICancerTypes = false;
  public isRetryButtonClicked = false;

  constructor() {
    makeObservable(this, {
      openCancerTypesUuid: observable,
      includedCancerTypes: observable,
      excludedCancerTypes: observable,
      isErrorFetchingICancerTypes: observable,
      isRetryButtonClicked: observable,
      setIncludedCancerTypes: action.bound,
      setExcludedCancerTypes: action.bound,
      setIsErrorFetchingICancerTypes: action.bound,
      setIsRetryButtonClicked: action.bound,
      openModal: action.bound,
      closeModal: action.bound,
    });
  }

  setIncludedCancerTypes(cancerTypes: CancerTypeSelectOption[]) {
    this.includedCancerTypes = cancerTypes;
  }

  setExcludedCancerTypes(cancerTypes: CancerTypeSelectOption[]) {
    this.excludedCancerTypes = cancerTypes;
  }

  setIsErrorFetchingICancerTypes(isError: boolean) {
    this.isErrorFetchingICancerTypes = isError;
  }

  setIsRetryButtonClicked(isClicked: boolean) {
    this.isRetryButtonClicked = isClicked;
  }

  openModal(cancerTypesUuid) {
    this.openCancerTypesUuid = cancerTypesUuid;
  }

  closeModal() {
    this.openCancerTypesUuid = null;
    this.includedCancerTypes = [];
    this.excludedCancerTypes = [];
    this.isErrorFetchingICancerTypes = false;
    this.isRetryButtonClicked = false;
  }
}