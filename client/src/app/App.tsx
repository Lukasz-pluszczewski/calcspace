import React, { useReducer, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaPlus, FaSignInAlt } from 'react-icons/fa';
import uuid from 'uuid/v4';
import bindDispatch from '../shared/bindDispatch';
import CardsList from '../cardsList/CardsList';
import SignInUpModal from '../signInUpModal/SignInUpModal';
import { getReducer, getInitialState, getCardActions, actions } from './state';
import { actions as reduxActions, selectors } from './store';
import { usePrevious } from './utils';
import { compareStates } from './syncService';
import styles from './App.module.scss';

const initializeState = () => getInitialState(uuid);

interface AppProps {
  user: { username: string } | null;
  fetchLoggedInUser: Function;
}

const App: React.FC<AppProps> = ({ user, fetchLoggedInUser }) => {
  const [state, dispatch] = useReducer(getReducer(uuid), null, initializeState);
  const { cards } = state;

  const { addCard, reorderCards } = bindDispatch(actions, dispatch);

  useEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  useEffect(() => {
    if (user) {
      console.log('TODO: Fetch cards (and discard any existing cards)');
    }
  }, [user]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const previousCards = usePrevious(cards);
  useEffect(() => {
    if (previousCards) {
      compareStates(previousCards, cards);
    }
  }, [cards]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>
          Math Notes{user && ` - ${user.username}`}
        </div>
        <div className={styles.icons}>
          <FaPlus title="Add new card" onClick={() => addCard()} />
          <FaSignInAlt
            title="Sign in / Sign up"
            onClick={() => setIsModalVisible(true)}
          />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <CardsList
          cards={cards}
          getCardActions={cardId =>
            bindDispatch(getCardActions(cardId), dispatch)
          }
        />
      </div>
      <SignInUpModal
        visible={isModalVisible}
        onHide={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default connect(
  state => ({
    user: selectors.user(state),
  }),
  {
    fetchLoggedInUser: reduxActions.fetchLoggedInUser,
  }
)(App);
