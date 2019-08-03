
/// <reference types="node" />

import { EventEmitter } from 'events'
import { SecureContextOptions } from 'tls'
import { TcpSocketConnectOpts, IpcSocketConnectOpts } from 'net'

export function createClient (options: ClientOptions): Client

/**
 * @see https://www.postgresql.org/docs/9.6/runtime-config-client.html
 */
export interface ClientOptions {
  user: string
  password?: string
  database?: string
  client_encoding?: string
  application_name?: string
  integer_datetimes?: boolean
  standard_conforming_strings?: boolean

  [key: string]: any
}

export interface Client {
  connect (options: ConnectionOptions | SecureConnectionOptions): Connection
}

export interface ConnectionOptions extends TcpSocketConnectOpts, IpcSocketConnectOpts {
  keepAlive?: boolean
}

export interface SecureConnectionOptions extends ConnectionOptions, SecureContextOptions {
  secure: true
  rejectUnauthorized?: boolean
}

export interface Connection extends EventEmitter {
  once (event: 'error', fn: (error: ConnectionError) => any): this
  on (event: 'error', fn: (error: ConnectionError) => any): this
  emit (event: 'error', error: ConnectionError): boolean

  once (event: 'close', fn: (hadError: boolean) => any): this
  on (event: 'close', fn: (hadError: boolean) => any): this
  emit (event: 'close', hadError: boolean): boolean

  once (event: 'ready', fn: () => any): this
  on (event:  'ready', fn: () => any): this
  emit (event: 'ready'): boolean

  once (event: 'connect', fn: () => any): this
  on (event:  'connect', fn: () => any): this
  emit (event: 'connect'): boolean

  execute (query: string, params?: Param[]): Statement
  close (): void
}

export interface ConnectionError extends Error {
  previous?: Error | ErrorResponse
}

export interface ErrorResponse {
  internalPosition?: string
  internalQuery?: string
  constraint?: string
  severity?: string
  position?: string
  dataType?: string
  routine?: string
  detail?: string
  schema?: string
  column?: string
  where?: string
  table?: string
  file?: string
  line?: string
  code?: string
  hint?: string
  message: string
}

export interface Statement extends EventEmitter {
  once (event: 'error', fn: (error: ConnectionError | StatementError) => any): this
  on (event: 'error', fn: (error: ConnectionError | StatementError) => any): this
  emit (event: 'error', error: ConnectionError | StatementError): boolean

  once (event: 'notice', fn: (msg: ErrorResponse) => any): this
  on (event: 'notice', fn: (msg: ErrorResponse) => any): this
  emit (event: 'notice', msg: ErrorResponse): boolean

  once (event: 'fields', fn: (fields: Field[]) => any): this
  on (event: 'fields', fn: (fields: Field[]) => any): this
  emit (event: 'fields', fields: Field[]): boolean

  once (event: 'complete', fn: (obj: Info) => any): this
  on (event: 'complete', fn: (obj: Info) => any): this
  emit (event: 'complete', obj: Info): boolean

  once (event: 'row', fn: (row: Value[]) => any): this
  on (event: 'row', fn: (row: Value[]) => any): this
  emit (event: 'row', row: Value[]): boolean

  once (event: 'end', fn: () => any): this
  on (event: 'end', fn: () => any): this
  emit (event: 'end'): boolean
}

export interface StatementError extends Error {
  previous?: Error | ErrorResponse
}

export type Param = null | string | Buffer

export type Value = null | Buffer

export interface Field {
  isBinary?: boolean
  modifier: number
  columnID: number
  tableID: number
  length: number
  name: string
  oid: number
}

export interface Info {
  rowCount: number
  command: string
}