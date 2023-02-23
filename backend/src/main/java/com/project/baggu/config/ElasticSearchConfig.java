package com.project.baggu.config;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories // elasticsearch repository 허용
public class ElasticSearchConfig extends AbstractElasticsearchConfiguration {

  /**
   *
   * ElasticSearch host, port setting
   *
   */
  @Value("${es.host}")
  private String hostAndPort;

  /**
   *
   * ElasticSearch Password Setting
   *
   */
  @Value("${es.pwd}")
  private String pwd;

  @Override
  public RestHighLevelClient elasticsearchClient() {
    ClientConfiguration clientConfiguration = ClientConfiguration.builder()
        .connectedTo(hostAndPort)
        .withBasicAuth("baggu",pwd)
        .build();
    return RestClients.create(clientConfiguration).rest();
  }
}