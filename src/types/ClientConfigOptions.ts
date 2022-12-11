/**
 * Configuration, which will be used to connect with config server and fetch environment specific properties.
 */
export interface ClientConfigOptions {
  uri: string;
  dbName: string;
  collectionName: string;
  connectionOptions: any;
  applicationId: string;
  filterProperty?: string;
}
