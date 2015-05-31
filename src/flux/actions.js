import Store from './store';

const Actions = {
  goTo(pageId, itemsToLoad) {
    itemsToLoad && Store.loadData(itemsToLoad);
    Store.setCurrentPage(pageId);
  },
  setCurrentTodo(tid) {
    Store.setCurrentTodo(tid);
  }
};

export default Actions;
