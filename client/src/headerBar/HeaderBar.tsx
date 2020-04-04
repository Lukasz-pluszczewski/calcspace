import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import styles from './HeaderBar.module.scss';

interface HeaderBarProps {
  setIsModalVisible: Function;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ setIsModalVisible }) => {
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerTitle}>
        <Link to="/">Math IDE</Link>
      </div>
      <div className={styles.icons}>
        <FaSignInAlt
          title="Sign in / Sign up"
          onClick={() => setIsModalVisible(true)}
        />
      </div>
    </div>
  );
};

export default HeaderBar;