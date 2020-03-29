const { RESTDataSource } = require('apollo-datasource-rest');

class VocabAPI extends RESTDataSource {
  constructor() {
    super();
    // this.baseURL = 'http://localhost:8080/'; // dev
    this.baseURL = 'https://iconic-era-271701.appspot.com/'; // prod
  }
  async getAllVocabs() {
    const response = await this.get('vocabs');
    return Array.isArray(response)
      ? response.map(vocab => this.vocabReducer(vocab))
      : [];
  }
  vocabReducer(vocab) {
    return {
      keyword: vocab.keyword,
      shortDef: vocab.shortDef,
      cambridgeDef: vocab.cambridgeDef,
      yahooDef: vocab.yahooDef,
      englishDef: vocab.englishDef,
    };
  }
  async getVocabById({ keyword }) {
    const response = await this.get('vocabs', { keyword });
    return this.vocabReducer(response);
  }
  getVocabsByIds({ keywords }) {
    return Promise.all(
      keywords.map(keyword => this.getVocabById({ keyword })),
    );
  }
}

module.exports = VocabAPI;
