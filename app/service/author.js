module.exports = app => {
  class author extends app.Service {
    /**
     * 批量添加用户
     * @param authorsDetailInfo
     */
    * authorInfoBatchSave( authorsDetailInfo ) {
      this.poetsClient = app.mysql.get('poets');
      /*
      * 先插入作者表，得到id后再插入anecdote表
      * */
      for ( let authorInfo of authorsDetailInfo ) {
        let authorId,
            anecdotePromises = [];
        try {
          authorId = yield this.insertAuthor( authorInfo );
        } catch (e) {
          console.log( 'insertAuthor err', JSON.stringify(e) );
          return;
        }
        authorInfo.anecdote.forEach( (anecdote) => {
          anecdotePromises.push( authorId, this.insertAnecdote(anecdote) );
        });
        try {
          yield anecdotePromises;
        } catch (e) {
          console.log( 'anecdotePromises err', JSON.stringify(e) );
          return;
        }
      }
    }
    /**
     * 插入author表
     * @param authorInfo
     */
    * insertAuthor( authorInfo ) {
      let result = yield this.poetsClient.insert('posts', { title: 'Hello World' });
    }
    /**
     * 插入anecdote表
     * @param authorId
     * @param anecdote
     * @returns {Promise}
     */
    insertAnecdote( authorId, anecdote ) {
      return new Promise( ( resolve, reject ) => {
        let anecdoteTitle = anecdote.anecdoteTitle;
        let anecdoteUrl = anecdote.anecdoteUrl;
        app.curl( anecdoteUrl, {
          dataType: 'text',
          timeout: 5000
        }).then( anecdoteRes => {
          //解析出内容，然后保存
          this.poetsClient.query().then();

        });

      });
    }
  }
  return author;
};
