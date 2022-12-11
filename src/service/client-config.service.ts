import { Injectable } from '@nestjs/common';
import { ClientConfigOptions } from '../types/ClientConfigOptions';
import { Logger } from '@nestutils/logger';
import { MongoClient } from 'mongodb';
import { ConfigDocument } from '../types/ConfigDocument';

@Injectable()
export class ClientConfigService {
  private readonly logger = new Logger({ context: ClientConfigService.name });
  private configOptions: ClientConfigOptions;
  private configProperties: Record<string, any> = {};
  private defaultPropertyField: string = 'applicationId';

  /**
   * @param {ClientConfigOptions} configOptions
   */
  constructor(configOptions: ClientConfigOptions) {
    this.configOptions = configOptions;
  }

  /**
   * Load configuration from client
   * @param {ClientConfigOptions} configOptions
   * @returns {Promise<ClientConfigService>}
   */
  async loadProperties(): Promise<void> {
    // Connect With Config Server & Fetch Environment Profile Data.
    this.logger.info('Started Loading Configuration Properties');

    let applicationConfiguration: Record<string, any> = {};

    // Load Configuration From Server
    try {
      this.logger.info(
        'Connecting With MongoDB Instance To Fetch Application Configuration.',
      );

      const client = await MongoClient.connect(
        this.configOptions.uri,
        this.configOptions.connectionOptions || {},
      );
      this.logger.info('Successfully Connected to MongoDb Config Instance');

      // Connecting With Database.
      const db = client.db(this.configOptions.dbName);
      const collection = db.collection<ConfigDocument>(
        this.configOptions.collectionName,
      );

      // Creating Filter Conditions
      let filterConditions: any = {};
      const filteringField = this.defaultPropertyField;
      filterConditions[filteringField] = this.configOptions.applicationId;

      // Fetch Data Based Upon Filter.
      let configProperties = await collection.findOne(filterConditions);
      if (configProperties) {
        this.logger.info('Successfully Fetched Application Configuration');
        applicationConfiguration = configProperties.credentials;
      } else {
        this.logger.warn(
          'Application Configuration Data not found on database.',
        );
      }

      // Set Fetched Config Properties Into Class Variable.
      this.configProperties = applicationConfiguration;

      // Apply Configuration to process.env
      for (let key in applicationConfiguration) {
        process.env[key] = applicationConfiguration[key];
      }
      this.logger.info(
        'Configuration Properties Setup Into Environment Completed.',
      );
    } catch (error) {
      this.logger.error(error);
      this.logger.error('Error occured while setting up application configuration.');
    }
  }

  /**
   * Get a property from config property. If not present in config, then lookup into process.env
   * @param property
   * @returns
   */
  public get<T = any>(property: string): T | undefined {
    let value = this.configProperties[property];

    if (value !== undefined) {
      return value as T;
    }

    value = process.env[property];
    return value as T | undefined;
  }
}
