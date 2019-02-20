const electronStore = jest.genMockFromModule('electron-store');

const noOp = () => { };

electronStore.get = noOp;
electronStore.set = noOp;
electronStore.delete = noOp;

module.exports = electronStore;
