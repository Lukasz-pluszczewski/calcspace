import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { SIGN_OUT_URL } from '../config';
import Spinner from '../shared/spinner';
import { selectors } from '../shared/filesStore';
import styles from './HeaderBar.module.scss';

interface HeaderBarProps {
  isSynchronizingAnyFile: boolean;
  username: string | null;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  username,
  isSynchronizingAnyFile,
}) => {
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTitle}>
        <Link to="/">Math IDE</Link>
        <Spinner size={18} show={isSynchronizingAnyFile} />
      </div>
      <div className={styles.icons}>
        <a href={SIGN_OUT_URL} className={styles.signOutLink}>
          Log Out
        </a>
        {username && <FaUserCircle title={`Logged in as "${username}"`} />}
      </div>
    </div>
  );
};

export default connect(state => ({
  isSynchronizingAnyFile: selectors.isSynchronizingAnyFile(state),
}))(HeaderBar);
