import {
  createReducer,
  createAsyncActionTypes,
  createAsyncActionCreator,
  createAsyncActionHandlers,
} from '../shared/reduxHelpers';
import httpRequest from '../shared/httpRequest';

const actionTypes = {
  fetchFiles: createAsyncActionTypes('FETCH_FILES'),
  addFile: createAsyncActionTypes('ADD_FILE'),
  deleteFile: createAsyncActionTypes('DELETE_FILE'),
  renameFile: createAsyncActionTypes('RENAME_FILE'),
};

export const actions = {
  fetchFiles: createAsyncActionCreator({
    actionTypes: actionTypes.fetchFiles,
    action: () => httpRequest.get('files'),
  }),
  addFile: createAsyncActionCreator({
    actionTypes: actionTypes.addFile,
    action: () => httpRequest.post('files'),
  }),
  deleteFile: createAsyncActionCreator({
    actionTypes: actionTypes.deleteFile,
    action: ({ id }) => httpRequest.delete(`files/${id}`),
    mapStartAction: (action, { id }) => ({ ...action, payload: { id } }),
    mapSuccessAction: (action, { id }) => ({ ...action, payload: { id } }),
    mapFailureAction: (action, { id }) => ({ ...action, payload: { id } }),
  }),
  renameFile: createAsyncActionCreator({
    actionTypes: actionTypes.renameFile,
    action: ({ id, oldName, newName }) =>
      httpRequest.put(`files/${id}/name`, { name: newName }),
    mapStartAction: (action, { id, oldName, newName }) => ({
      ...action,
      payload: { id, newName },
    }),
    mapSuccessAction: (action, { id, oldName, newName }) => ({
      ...action,
      payload: { id },
    }),
    mapFailureAction: (action, { id, oldName, newName }) => ({
      ...action,
      payload: { id, oldName },
    }),
  }),
};

const TEMP_ID = 'TEMP_ID';

export const reducer = createReducer({
  initialState: {
    files: [],
    isFetchingFiles: false,
    fetchingFilesError: false,
  },
  actionHandlers: {
    ...createAsyncActionHandlers({
      types: actionTypes.fetchFiles,
      payloadKey: 'files',
      pendingKey: 'isFetchingFiles',
      errorKey: 'fetchingFilesError',
    }),

    [actionTypes.addFile.START]: state => ({
      ...state,
      files: [
        { id: TEMP_ID, name: 'Unnamed file', code: '', isCreating: true },
        ...state.files,
      ],
    }),
    [actionTypes.addFile.SUCCESS]: (state, payload) => ({
      ...state,
      files: state.files.map(file => (file.id === TEMP_ID ? payload : file)),
    }),
    [actionTypes.addFile.FAILURE]: state => ({
      ...state,
      files: state.files.filter(({ id }) => id !== TEMP_ID),
    }),

    [actionTypes.deleteFile.START]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isDeleting: true } : file
      ),
    }),
    [actionTypes.deleteFile.SUCCESS]: (state, { id }) => ({
      ...state,
      files: state.files.filter(file => file.id !== id),
    }),
    [actionTypes.deleteFile.FAILURE]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isDeleting: false } : file
      ),
    }),

    [actionTypes.renameFile.START]: (state, { id, newName }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, name: newName, isRenaming: true } : file
      ),
    }),
    [actionTypes.renameFile.SUCCESS]: (state, { id }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, isRenaming: false } : file
      ),
    }),
    [actionTypes.renameFile.FAILURE]: (state, { id, oldName }) => ({
      ...state,
      files: state.files.map(file =>
        file.id === id ? { ...file, name: oldName, isRenaming: false } : file
      ),
    }),
  },
});

export const selectors = {
  files: state => state.filesList.files,
  isFetchingFiles: state => state.filesList.isFetchingFiles,
  fetchingFilesError: state => state.filesList.fetchingFilesError,
  isCreatingFile: state =>
    state.filesList.files.some(({ isCreating }) => isCreating),
};
