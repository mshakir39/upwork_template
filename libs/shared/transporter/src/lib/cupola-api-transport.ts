import { CupolaTransporter } from "./cupola-transporter";
import { AxiosInstance, AxiosResponse } from "axios";

import {
  ProjectEntity,
  TimesheetEntryEntity,
  InvoiceEntity,
} from "@cupola/types";

import { APIRoutes } from "./routes";

export class CupolaAPITransport implements CupolaTransporter {
  host: string;
  constructor(
    readonly getHost: () => string,
    readonly http: AxiosInstance,
    readonly apiRoutes: APIRoutes
  ) {
    this.host = getHost();
  }

  project = {
    getAll: async (filter?: Partial<ProjectEntity>): Promise<AxiosResponse> => {
      return this.http.get(`${this.host}/${this.apiRoutes.projects.getAll}`, {
        params: filter,
      });
    },
  };
  invoice = {
    get: (
      invoiceNum: string,
      invoiceDate: Date,
      terms: string,
      From: Record<string, string>,
      invoiceFor: Record<string, string>,
      projectName: string,
      taxRate: number,
      invoiceData: Array<Record<string, string>>,
      notes: string
    ): Promise<AxiosResponse<InvoiceEntity>> => {
      return this.http.get(`${this.host}/${this.apiRoutes.invoice.get}`, {
        params: {
          invoiceNum: invoiceNum,
          invoiceDate: invoiceDate,
          terms: terms,
          From: From,
          invoiceFor: invoiceFor,
          projectName: projectName,
          taxRate: taxRate,
          invoiceData: invoiceData,
          notes: notes,
        },
      });
    },
  };

  role = {
    getAll: (): Promise<AxiosResponse> => {
      return this.http.get(`${this.host}/${this.apiRoutes.role.getAll}`, {});
    },
  };

  timesheet = {
    get: (
      startDate: Date,
      endDate: Date
    ): Promise<AxiosResponse<TimesheetEntryEntity[]>> => {
      return this.http.get(`${this.host}/${this.apiRoutes.timesheet.get}`, {
        params: {
          startDate: startDate.toISOString().replace(/T.*/, ""),
          endDate: endDate.toISOString().replace(/T.*/, ""),
        },
      });
    },
    post: (
      date: Date,
      hours: number,
      minutes: number,
      projectId: string,
      notes: string,
      phase: string
    ): Promise<AxiosResponse<Partial<TimesheetEntryEntity>>> => {
      return this.http.post(`${this.host}/${this.apiRoutes.timesheet.post}`, {
        date: date,
        hours: hours,
        minutes: minutes,
        notes: notes,
        phase: phase,
        projectId: projectId,
      });
    },
  };
}
