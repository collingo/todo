import Store from './store';

const Actions = {
  goTo(pageId, itemsToLoad) {
    itemsToLoad && Store.loadData(itemsToLoad);
    Store.setCurrentPage(pageId);
  }
};

export default Actions;
