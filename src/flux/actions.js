import Store from './store';

const Actions = {
  goTo(pageId, itemsToLoad) {
    itemsToLoad && Store.loadData(itemsToLoad);
    Store.setPage(pageId);
  },
  setTodo(tid) {
    Store.setTodo(tid);
  }
};

export default Actions;
