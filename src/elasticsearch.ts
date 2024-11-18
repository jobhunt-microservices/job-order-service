import { config } from '@order/config';
import { SERVICE_NAME } from '@order/constants';
import { logger } from '@order/utils/logger.util';
import { Client } from '@elastic/elasticsearch';
import { getErrorMessage, ISellerGig } from '@jobhunt-microservices/jobhunt-shared';

const log = logger('orderElasticSearchConnection', 'debug');

class ElasticSearch {
  public elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      try {
        const health = await this.elasticSearchClient.cluster.health({});
        log.info(SERVICE_NAME + ` elasticsearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error(SERVICE_NAME + ' connection to elasticsearch failed, retrying');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        log.log('error', SERVICE_NAME + ' checkConnection() method:', getErrorMessage(error));
      }
    }
  }

  async checkIfIndexExist(indexName: string): Promise<boolean> {
    const result: boolean = await this.elasticSearchClient.indices.exists({ index: indexName });
    return result;
  }

  async createIndex(indexName: string): Promise<void> {
    try {
      const result: boolean = await this.checkIfIndexExist(indexName);
      if (result) {
        log.info(`Index "${indexName}" already exist.`);
      } else {
        await this.elasticSearchClient.indices.create({ index: indexName });
        await this.elasticSearchClient.indices.refresh({ index: indexName });
        log.info(`Created index ${indexName}`);
      }
    } catch (error) {
      log.error(`An error occurred while creating the index ${indexName}`);
      log.log('error', 'GigService createIndex() method error:', getErrorMessage(error));
    }
  }

  getDocumentCount = async (index: string): Promise<number> => {
    try {
      const result = await this.elasticSearchClient.count({ index });
      return result.count;
    } catch (error) {
      log.log('error', 'GigService elasticsearch getDocumentCount() method error:', getErrorMessage(error));
      return 0;
    }
  };

  getIndexedData = async (index: string, itemId: string): Promise<ISellerGig> => {
    try {
      const result = await this.elasticSearchClient.get({ index, id: itemId });
      return result._source as ISellerGig;
    } catch (error) {
      log.log('error', 'GigService elasticsearch getIndexedData() method error:', getErrorMessage(error));
      return {} as ISellerGig;
    }
  };
}

export const elasticSearch = new ElasticSearch();
