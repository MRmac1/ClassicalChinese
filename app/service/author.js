module.exports = app => {
  class author extends app.Service {
    * authorInfoBatchSave( authorsDetailInfo ) {
      console.log( 'authorsDetailInfo',  authorsDetailInfo );
      return;
    }
  }
  return author;
};
