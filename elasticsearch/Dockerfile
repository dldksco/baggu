# 작성
ARG ELK_VERSION
FROM docker.elastic.co/elasticsearch/elasticsearch:${ELK_VERSION}
RUN elasticsearch-plugin install analysis-nori
# 엘라스틱서치 설정 복사
#COPY ./config/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml