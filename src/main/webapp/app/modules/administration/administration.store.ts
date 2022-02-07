import { action, observable, makeObservable } from 'mobx';
import axios, { AxiosResponse } from 'axios';
import BaseStore from 'app/shared/util/base-store';
import { IRootStore } from 'app/shared/stores';
export class AdministrationStore extends BaseStore {
  public gateway = {
    routes: [],
  };
  public logs = {
    loggers: [] as any[],
  };
  public health: any = {};
  public metrics: any = {};
  public threadDump = [];
  public configuration = {
    configProps: {} as any,
    env: {} as any,
  };
  public audits = [];
  public totalItems = 0;

  gatewayRoutes = this.readHandler(this.gateRoutes);

  systemHealth = this.readHandler(this.sysHealth);

  systemMetrics = this.readHandler(this.sysMetrics);

  systemThreadDump = this.readHandler(this.sysThreadDump);

  getLoggers = this.readHandler(this.loggers);

  changeLogLevel = this.updateHandler(this.changeLogLev);

  getConfigurations = this.readHandler(this.getConf);

  getEnv = this.readHandler(this.getEnvir);

  getAudits = this.readHandler(this.getAudit);

  constructor(protected rootStore: IRootStore) {
    super(rootStore);

    makeObservable(this, {
      gateway: observable,
      logs: observable,
      health: observable,
      metrics: observable,
      threadDump: observable,
      configuration: observable,
      audits: observable,
      totalItems: observable,
      gatewayRoutes: action,
      systemHealth: action,
      systemMetrics: action,
      systemThreadDump: action,
      getLoggers: action,
      changeLogLevel: action,
      getConfigurations: action,
      getEnv: action,
      getAudits: action,
    });
  }

  // Actions
  *gateRoutes() {
    const result: AxiosResponse = yield axios.get('/api/gateway/routes');
    this.gateway.routes = result.data;
    return result;
  }

  *sysHealth() {
    const result: AxiosResponse = yield axios.get('/management/health');
    this.health = result.data;
    return result;
  }

  *sysMetrics() {
    const result: AxiosResponse = yield axios.get('/management/jhimetrics');
    this.metrics = result.data;
    return result;
  }

  *sysThreadDump() {
    const result: AxiosResponse = yield axios.get('/management/threaddump');
    this.threadDump = result.data;
    return result;
  }

  *loggers() {
    const result: AxiosResponse = yield axios.get('/management/loggers');
    this.logs.loggers = result.data.loggers;
    return result;
  }

  *changeLogLev(name, configuredLevel) {
    const body = { configuredLevel };
    const result: AxiosResponse = yield axios.post('/management/loggers/' + name, body);
    yield* this.loggers();
    return result;
  }

  *getConf() {
    const result: AxiosResponse = yield axios.get('/management/configprops');
    this.configuration.configProps = result.data;
    return result;
  }

  *getEnvir() {
    const result: AxiosResponse = yield axios.get('/management/env');
    this.configuration.env = result.data;
    return result;
  }

  *getAudit(page, size, sort, fromDate, toDate) {
    let requestUrl = `/management/audits${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
    if (fromDate) {
      requestUrl += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      requestUrl += `&toDate=${toDate}`;
    }
    const result: AxiosResponse = yield axios.get(requestUrl);
    this.audits = result.data;
    this.totalItems = result.headers['x-total-count'];
    return result;
  }
}

export default AdministrationStore;
