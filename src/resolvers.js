module.exports = {
  Query: {
    vocabs: async (_, __, { dataSources }) => {
      const allVocabs = await dataSources.vocabAPI.getAllVocabs();
      return allVocabs;
    },
    vocab: (_, { keyword }, { dataSources }) =>
    dataSources.vocabAPI.getVocabById({ keyword }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },

  Vocab: {
    isAdded: async (vocab, _, { dataSources }) =>
      dataSources.userAPI.isAddedOnVocab({ keyword: vocab.keyword }),
  },

  User: {
    favorites: async (_, __, { dataSources }) => {
      const keywords = await dataSources.userAPI.getFavoritesByUser();

      if (!keywords.length) return [];
  
      // look up those favorites by their ids
      return (
        dataSources.vocabAPI.getVocabsByIds({
          keywords: keywords,
        }) || []
      );
    },
  },

  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString('base64');
    },
    addFavorite: async (_, { keyword }, { dataSources }) => {
      const results = await dataSources.userAPI.addFavorite({ keyword });
      const vocab = await dataSources.vocabAPI.getVocabById({ keyword });
      return {
        success: !!results,
        keyword,
        vocab,
      };
    },
    removeFavorite: async (_, { keyword }, { dataSources }) => {
      const result = await dataSources.userAPI.removeFavorite({ keyword });
      const vocab = await dataSources.vocabAPI.getVocabById({ keyword });
      return {
        success: !!result,
        keyword,
        vocab,
      };
    },
  },
};
